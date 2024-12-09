// src/components/ReceiveToken.tsx
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/ui/state/WalletContext";
import { useToast } from "@/ui/providers/toast";
import { networks } from "bitcoinjs-lib";
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
import { getBitcoinAddress } from "@/shared/lib/btc/utils/hdWallet";

const ReceiveToken = () => {
    const { selectedProtocol, seedphrase, selectedAccount, selectedNetwork } = useContext(WalletContext);
    const { createToast } = useToast();
    const [publicAddress, setPublicAddress] = useState<string>("");

    const getPublicAddress = () => {
        console.log("getPublicAddress called");
        if (!selectedProtocol) {
            console.log("selectedProtocol is undefined or null");
            return "";
        }
        if (!seedphrase || seedphrase.length === 0) {
            console.log("seedphrase is undefined, null, or empty");
            return "";
        }
        if (!selectedAccount) {
            console.log("selectedAccount is undefined or null");
            return "";
        }
        try {
            console.log("All required context values are present");
            const network = selectedNetwork?.networkId === "testnet" ? networks.testnet : networks.bitcoin;

            const seed = mnemonicToSeedSync(seedphrase.join(" "));
            const root = HDKey.fromMasterSeed(seed);
            console.log(`Derived root from seed: ${root}`);
            const child = root.derive(selectedAccount.path);
            console.log(`Derived child node from path ${selectedAccount.path}: ${child}`);
            const address = getBitcoinAddress(child, network);
            console.log(`Generated address: ${address}`);
            return address;
        } catch (error) {
            console.error("ReceiveToken Error:", error);
            createToast("Failed to generate public address.", "error");
            return "";
        }
    };

    useEffect(() => {
        const address = getPublicAddress();
        setPublicAddress(address);
    }, [selectedProtocol, seedphrase, selectedAccount]);

    return (
        <div>
            <h2>Receive {selectedProtocol?.name}</h2>
            <p>
                <strong>Public Address:</strong> {publicAddress || "Generating address..."}
            </p>
            {publicAddress /* Uncomment when ready to use QRCode */ &&
                // <QRCode value={publicAddress} />
                null}
        </div>
    );
};

export default ReceiveToken;
