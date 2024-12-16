// src/utils/hdWallet.ts
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
import * as bitcoin from "bitcoinjs-lib";

/**
 * Derives an HD node from a mnemonic and BIP44 path.
 * @param {string} mnemonic - The mnemonic phrase.
 * @param {string} [accountPathSuffix="0'/0/0"] - The suffix for the derivation path.
 * @returns {HDKey} The derived HD node.
 */
export const deriveHDNode = (mnemonic: string, accountPathSuffix: string = "0'/0/0"): HDKey => {
    // Convert mnemonic to seed
    const seed = mnemonicToSeedSync(mnemonic);

    // Create HDKey from seed
    const hdKey = HDKey.fromMasterSeed(seed);

    // Construct full derivation path
    const derivationPath = accountPathSuffix;

    // Derive the key
    const derivedKey = hdKey.derive(derivationPath);

    if (!derivedKey.privateKey) {
        throw new Error("Failed to derive private key.");
    }

    return derivedKey;
};

/**
 * Generates a Bitcoin address from an HD node.
 * @param {HDKey} hdNode - The HD node.
 * @param {bitcoin.Network} [network=bitcoin.networks.bitcoin] - The Bitcoin network.
 * @returns {string} The generated Bitcoin address.
 */
export const getBitcoinAddress = (hdNode: HDKey, network: bitcoin.Network = bitcoin.networks.bitcoin): string => {
    if (!hdNode.publicKey) {
        throw new Error("Public key is null.");
    }

    // Convert Uint8Array to Buffer
    const publicKeyBuffer = Buffer.from(hdNode.publicKey);

    // Generate the Bitcoin address
    const { address } = bitcoin.payments.p2wpkh({
        pubkey: publicKeyBuffer,
        network,
    });

    if (!address) {
        throw new Error("Failed to generate Bitcoin address.");
    }
    return address;
};
