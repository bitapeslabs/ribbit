// src/shared/lib/btc/utils/signAndBroadcast.ts
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
import * as btc from "@scure/btc-signer";
import { hex } from "@scure/base";
import { Protocol } from "@/ui/state/WalletContext";
import { Signer } from "@scure/btc-signer/transaction";
import { equalBytes, hash160, isBytes, pubECDSA } from "@scure/btc-signer/utils";

async function broadcastTransaction(signedTx: string): Promise<string> {
    const response = await fetch("https://blockstream.info/api/tx", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: signedTx,
    });

    if (!response.ok) throw new Error(`Broadcast failed: ${response.statusText}`);
    const txId = await response.text();
    return txId;
}

export async function signAndBroadcast(psbtBase64: string, seedphrase: string[], protocol: Protocol): Promise<string> {
    try {
        // Convert base64 psbt to Uint8Array
        const psbtBytes = new Uint8Array([...atob(psbtBase64)].map((c) => c.charCodeAt(0)));
        const tx = btc.Transaction.fromPSBT(psbtBytes);

        // Determine network bip44
        const net = protocol.bip44 === 1 ? "testnet" : "mainnet";
        const defaultBip44 = net === "mainnet" ? 0 : 1;

        // Derive private key
        const seed = mnemonicToSeedSync(seedphrase.join(" "));
        const hdNode = HDKey.fromMasterSeed(seed);
        const derivationPath = `m/84'/${defaultBip44}'/0'/0/0`;
        const derivedKey = hdNode.derive(derivationPath);
        if (!derivedKey.privateKey) throw new Error("Failed to derive private key.");

        //const privateKey = derivedKey.privateKey;
        const privateKey = derivedKey.privateKey;
        const publicKey = derivedKey.publicKey;

        // Debug logging
        console.log("Number of inputs:", tx.inputsLength);

        // Manually add public key to the transaction
        for (let i = 0; i < tx.inputsLength; i++) {
            try {
                console.log("____________________________________");
                const test = tx.getInput(i);
                console.log(test);
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee");
                const testInputType = btc.getInputType(test);
                console.log(testInputType);
                console.log("____________________________________");
                const pubKey = pubECDSA(privateKey);
                let hasPubkey = false;
                const pubKeyHash = hash160(pubKey);
                console.log("pubKey: ", pubKey);
                console.log("pubKeyHash: ", pubKeyHash);

                for (const idx of btc.Script.decode(testInputType.lastScript)) {
                    console.log("idx: ", idx)
                    console.log("isBytes(i): ", isBytes(idx))
                    console.log("equalBytes(i, pubKey): ", isBytes(idx) && equalBytes(idx, pubKey))
                    console.log("equalBytes(i, pubKeyHash): ", isBytes(idx) && equalBytes(idx, pubKeyHash))
                    console.log("hasPubkey: ", hasPubkey)
                    if (isBytes(idx) && (equalBytes(idx, pubKey) || equalBytes(idx, pubKeyHash))) hasPubkey = true;
                }
                console.log("____________________________________");
                // Manually add public key and sign
                tx.signIdx(privateKey as Signer, i, [btc.SigHash.ALL]);
            } catch (signError) {
                console.error(`Error signing input ${i}:`, signError);
                throw signError;
            }
        }

        // Finalize all inputs
        tx.finalize();

        // Extract fully signed transaction
        const signedTxBytes = tx.extract();
        const signedTxHex = hex.encode(signedTxBytes);

        // Broadcast
        const txId = await broadcastTransaction(signedTxHex);
        return txId;
    } catch (error) {
        console.error("SignAndBroadcast Error:", error);
        throw error; // Rethrow to preserve original error details
    }
}
