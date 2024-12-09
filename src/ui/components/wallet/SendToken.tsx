// src/components/SendToken.tsx
import React, { useContext, useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import { WalletContext } from "@/ui/state/WalletContext";
import { useToast } from "@/ui/providers/toast";
import { deriveHDNode, getBitcoinAddress } from "@/shared/lib/btc/utils/hdWallet";
import { callProtocolMethod } from "@/shared/lib/btc/utils/protocolMethods";
import { signAndBroadcast } from "@/shared/lib/btc/utils/signAndBroadcast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UTXO {
    txid: string;
    vout: number;
    value: number; // in satoshis
    scriptpubkey: string; // script pub key
}

const SendToken: React.FC = () => {
    const { selectedProtocol, seedphrase, selectedAccount, selectedNetwork, isUnlocked } = useContext(WalletContext);
    const [amount, setAmount] = useState<string>("0");
    const [toAddress, setToAddress] = useState<string>("");
    const { createToast } = useToast();

    const handleSend = async () => {
        if (!isUnlocked || !selectedProtocol || !seedphrase || !selectedAccount || !selectedNetwork) {
            createToast("Please unlock your wallet and select a protocol, network, and account.", "error");
            return;
        }

        // Validate input fields
        if (!toAddress) {
            createToast("Please enter a recipient address.", "error");
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            createToast("Please enter a valid amount greater than 0.", "error");
            return;
        }

        try {
            // Derive HD node
            const hdNode = deriveHDNode(seedphrase.join(" "), selectedAccount.path);

            // Determine network
            const network = selectedNetwork.networkId === "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

            // Generate public address
            const publicAddress = getBitcoinAddress(hdNode, network);

            // Fetch all UTXOs using getUtxos
            const utxoData = await callProtocolMethod(selectedProtocol.scriptUrl, "getUtxos", [publicAddress, selectedNetwork.networkId]);

            console.log("utxoData", utxoData);

            const allUtxos: UTXO[] = utxoData.utxos || [];
            if (allUtxos.length === 0) {
                createToast("No UTXOs available for this address.", "warning");
                return;
            }

            // Fetch unspendable UTXOs (empty for Bitcoin)
            const excludedUtxoData = await callProtocolMethod(selectedProtocol.scriptUrl, "getUnspendables", [publicAddress, selectedNetwork.networkId]);
            const excludedUtxos: UTXO[] = excludedUtxoData.unspendables || [];

            // Filter out unspendable UTXOs
            const spendableUtxos = allUtxos.filter(utxo => 
                !excludedUtxos.some(ex => ex.txid === utxo.txid && ex.vout === utxo.vout)
            );

            if (spendableUtxos.length === 0) {
                createToast("No spendable UTXOs available for this address.", "warning");
                return;
            }

            console.log("spendableUtxos", spendableUtxos);

            // Calculate total available
            const totalAvailable = spendableUtxos.reduce((sum, utxo) => sum + utxo.value, 0);

            // Convert BTC to satoshis
            const amountSats = Math.round(parsedAmount * 1e8);

            // Estimate fee
            const fee = calculateFee(spendableUtxos.length, 2); // Assuming 2 outputs (recipient + change)

            if (totalAvailable < amountSats + fee) {
                createToast("Insufficient balance for this transaction.", "warning");
                return;
            }

            // Create unsigned transaction
            const txData = await callProtocolMethod(selectedProtocol.scriptUrl, "createUnsignedTransaction", [
                {
                    fromAddress: publicAddress,
                    toAddress: toAddress,
                    amount: amountSats, // in satoshis
                    fee: fee, // in satoshis
                    network: selectedNetwork.networkId,
                    seedphrase: seedphrase,
                    utxos: spendableUtxos,
                },
            ]);

            console.log("txData", txData);

            // txData should contain psbtBase64, inputs, outputs, etc.
            const psbtBase64 = txData.psbtBase64;
            if (!psbtBase64) {
                throw new Error("No PSBT returned by createUnsignedTransaction.");
            }

            console.log("psbtBase64", psbtBase64);

            // Sign and broadcast the transaction
            const txId = await signAndBroadcast(psbtBase64, seedphrase, selectedProtocol);

            createToast(`Transaction sent successfully! TX ID: ${txId}`, "success");
            console.log("Broadcast Result:", txId);
        } catch (error) {
            console.error("SendToken Error:", error);
            createToast(`Failed to send tokens: ${(error as Error).message}`, "error");
        }
    };

    /**
     * Calculate Transaction Fee
     * @param {number} inputsCount - Number of inputs
     * @param {number} outputsCount - Number of outputs
     * @returns {number} Fee in satoshis
     */
    const calculateFee = (inputsCount: number, outputsCount: number): number => {
        // P2WPKH: ~68 vbytes per input, ~31 vbytes per output, plus 10 vbytes overhead
        const txSize = inputsCount * 68 + outputsCount * 31 + 10;

        // Fetch fee rate from an API or use a hardcoded rate
        // For demonstration, we'll use 5 sat/vbyte
        const satPerVbyte = 5;
        return txSize * satPerVbyte;
    };

    return (
        <div className="flex flex-col gap-2">
            <h2>Send {selectedProtocol?.name}</h2>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="recipient">Send To</Label>
                <Input 
                    type="text" 
                    id="recipient" 
                    placeholder="Recipient Address" 
                    value={toAddress} 
                    onChange={(e) => setToAddress(e.target.value)} 
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="tokenAmount">Amount to send (BTC)</Label>
                <Input 
                    type="number" 
                    id="tokenAmount" 
                    placeholder="Amount in BTC" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    step="0.00000001" // Allow up to 8 decimal places
                />
            </div>
            <Button onClick={handleSend}>Send</Button>
        </div>
    );
};

export default SendToken;
