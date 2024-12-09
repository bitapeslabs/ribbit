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
    rawTx: string; // raw transaction hex
}

const SendToken: React.FC = () => {
    const { selectedProtocol, seedphrase, selectedAccount, selectedNetwork, isUnlocked } = useContext(WalletContext);
    const [amount, setAmount] = useState<number>(0);
    const [toAddress, setToAddress] = useState<string>("");
    const { createToast } = useToast();

    const handleSend = async () => {
        if (!isUnlocked || !selectedProtocol || !seedphrase || !selectedAccount || !selectedNetwork) {
            createToast("Please unlock your wallet and select a protocol, network, and account.", "error");
            return;
        }

        try {
            // Derive HD node
            const hdNode = deriveHDNode(seedphrase.join(" "), selectedAccount.path);

            // Determine network
            const network = selectedNetwork.networkId === "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

            // Generate public address
            const publicAddress = getBitcoinAddress(hdNode, network);

            // Fetch UTXOs from protocol functions
            const utxoData = await callProtocolMethod(selectedProtocol.scriptUrl, "getUnspendables", [publicAddress, selectedNetwork.networkId]);

            const utxos: UTXO[] = utxoData.unspendables || [];
            if (utxos.length === 0) {
                createToast("No UTXOs available for this address.", "warning");
                return;
            }

            console.log("utxos", utxos);

            // Calculate total available
            const totalAvailable = utxos.reduce((sum, utxo) => sum + utxo.value, 0);

            const fee = calculateFee(utxos);

            if (totalAvailable < amount + fee) {
                createToast("Insufficient balance for this transaction.", "warning");
                return;
            }

            // Create unsigned transaction
            // The protocol function expects an object with parameters
            const txData = await callProtocolMethod(selectedProtocol.scriptUrl, "createUnsignedTransaction", [
                {
                    fromAddress: publicAddress,
                    toAddress: toAddress,
                    amount: amount,
                    fee: fee,
                    network: selectedNetwork.networkId,
                    seedphrase: seedphrase,
                    unspendables: utxos,
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

    const calculateFee = (utxos: UTXO[]): number => {
        // P2WPKH #inputs * 68 vbytes + #outputs * 31 vbytes + overhead
        const inputsCount = utxos.length;
        const outputsCount = 2; // one recipient + possibly one change

        // Rough estimate
        // Input ~68 vbytes, Output ~31 vbytes + 10 overhead
        const txSize = inputsCount * 68 + outputsCount * 31 + 10;

        // Suppose we fetch a fee rate from an API or hardcode a rate:
        // Let's assume 5 sat/vbyte for demo
        const satPerVbyte = 5;
        return txSize * satPerVbyte;
    };

    return (
        <div className="flex flex-col gap-2">
            <h2>Send {selectedProtocol?.name}</h2>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="recipient">Send To</Label>
                <Input type="text" id="recipient" placeholder="Recipient Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="tokenAmount">Amount to send (satoshis)</Label>
                <Input type="text" id="tokenAmount" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <Button onClick={handleSend}>Send</Button>
        </div>
    );
};

export default SendToken;
