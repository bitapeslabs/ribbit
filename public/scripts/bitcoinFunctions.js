import { mnemonicToSeedSync } from 'https://esm.sh/@scure/bip39@1.5.0';
import { HDKey } from 'https://esm.sh/@scure/bip32@1.6.0';
import * as btc from 'https://esm.sh/@scure/btc-signer@1.5.0';
import { base16, base64 } from 'https://esm.sh/@scure/base@1.2.1';

// Network Configuration
const NETWORK_CONFIG = {
  mainnet: {
    bech32: 'bc',
    network: btc.NETWORK
  },
  testnet: {
    bech32: 'tb',
    network: btc.TEST_NETWORK
  }
};


// Utility Functions
function hexToBytes(hex) {
  return new Uint8Array(
    hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );
}

/**
 * Blockstream API URL Resolver
 * @param {string} network - Network identifier
 * @returns {string} API base URL
 */
function getApiBaseUrl(network) {
  if (network === 'mainnet') return 'https://blockstream.info/api';
  if (network === 'testnet') return 'https://blockstream.info/testnet/api';
  throw new Error(`Unsupported network: ${network}`);
}

/**
 * Fetch JSON from a given URL
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Parsed JSON response
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export const protocolFunctions = {
  /**
   * Retrieve Token Balance for Address
   * @param {string} address - Bitcoin address
   * @param {string} network - Network identifier
   * @returns {Promise<Object>} Balance information
   */
  async getTokensForAddress(address, network) {
    const baseUrl = getApiBaseUrl(network);
    const data = await fetchJson(`${baseUrl}/address/${address}`);
    const balanceSats = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) || 0;
    const balanceBtc = balanceSats / 1e8;

    return {
      address,
      network,
      tokens: [{ symbol: 'BTC', balance: balanceBtc.toFixed(8) }]
    };
  },

  /**
   * Retrieve Unspendable UTXOs
   * @param {string} address - Bitcoin address
   * @param {string} network - Network identifier
   * @returns {Promise<Object>} UTXO details
   */
  async getUnspendables(address, network) {
    const baseUrl = getApiBaseUrl(network);
    const utxos = await fetchJson(`${baseUrl}/address/${address}/utxo`);

    const detailedUtxos = await Promise.all(utxos.map(async (utxo) => {
      const txData = await fetchJson(`${baseUrl}/tx/${utxo.txid}`);
      const voutData = txData.vout[utxo.vout];

      return {
        txid: utxo.txid,
        vout: utxo.vout,
        value: voutData.value,
        confirmed: utxo.status.confirmed,
        block_height: utxo.status.block_height || null,
        scriptpubkey: voutData.scriptpubkey
      };
    }));

    return { address, network, unspendables: detailedUtxos };
  },

  /**
   * Create Unsigned Bitcoin Transaction
   * @param {Object} params - Transaction parameters
   * @returns {Promise<Object>} Unsigned transaction details
   */
  async createUnsignedTransaction({
    fromAddress,
    toAddress,
    amount,
    fee,
    network,
    seedphrase,
    unspendables
  }) {
    // Validate inputs
    if (!fromAddress || !toAddress || amount == null || fee == null || !network || !seedphrase || !unspendables.length) {
      throw new Error('Missing or invalid transaction parameters');
    }

    const networkConfig = NETWORK_CONFIG[network];

    // Derive HD Key
    const mnemonic = seedphrase.join(' ');
    const seed = mnemonicToSeedSync(mnemonic);
    const hdNode = HDKey.fromMasterSeed(seed);
    const derivationPath = `m/84'/${network === 'mainnet' ? 0 : 1}'/0'/0/0`;
    const derivedKey = hdNode.derive(derivationPath);

    if (!derivedKey.privateKey) {
      throw new Error('Failed to derive private key');
    }

    // Create payment method
    const payment = btc.p2wpkh(derivedKey.private, networkConfig.network);

    // Validate derived address
    if (payment.address !== fromAddress) {
      throw new Error(`Derived address ${payment.address} does not match from address ${fromAddress}`);
    }

    // Initialize transaction
    const tx = new btc.Transaction();

    // Calculate and add inputs
    const totalInput = unspendables.reduce((total, utxo) => {
      // Validate UTXO
      if (!utxo.txid || utxo.vout === undefined || !utxo.value || !utxo.scriptpubkey) {
        throw new Error(`Invalid UTXO: ${JSON.stringify(utxo)}`);
      }

      // Decode scriptpubkey
      const utxoScript = hexToBytes(utxo.scriptpubkey);

      // Add input
      tx.addInput({
        txid: utxo.txid,
        index: utxo.vout,
        sequence: btc.DEFAULT_SEQUENCE,
        witnessUtxo: {
          script: utxoScript,
          amount: BigInt(utxo.value)
        },
        sighashType: btc.SigHash.ALL,
      });
      return total + utxo.value;
    }, 0);

    // Convert amount to satoshis
    const amountSats = Math.round(amount * 1e8);
    const totalRequired = amountSats + fee;

    // Validate sufficient funds
    if (totalInput < totalRequired) {
      throw new Error(`Insufficient funds: ${totalInput} < ${totalRequired}`);
    }

    console.log("toAddress", toAddress)
    // Add recipient output
    tx.addOutputAddress(toAddress, BigInt(amountSats), networkConfig.network);

    // Add change output if necessary
    const changeAmount = totalInput - totalRequired;
    if (changeAmount > 0) {
      tx.addOutput({
        //address: payment.address,
        script: payment.script,
        amount: BigInt(changeAmount),
      });
    }

    console.log(payment.address, payment.script)

    // Convert to PSBT
    const psbtBytes = tx.toPSBT();
    const psbtBase64 = base64.encode(psbtBytes);

    return {
      network,
      fromAddress,
      toAddress,
      amount: amountSats.toString(),
      fee: fee.toString(),
      //inputs: unspendables.map(u => ({ txid: u.txid, vout: u.vout, value: u.value })),
      inputs: unspendables,
      //outputs: tx.outputs.map(o => ({ script: o.script, value: o.amount })),
      outputs: tx.outputs,
      psbtBase64
    };
  }
};