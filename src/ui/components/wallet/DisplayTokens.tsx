// src/components/DisplayTokens.tsx
import React, { useContext, useEffect, useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import { WalletContext } from "@/ui/state/WalletContext";
import { useToast } from "@/ui/providers/toast";
import { deriveHDNode, getBitcoinAddress } from "@/shared/lib/btc/utils/hdWallet";
import { callProtocolMethod } from "@/shared/lib/btc/utils/protocolMethods";
import BalanceDisplay from "./BalanceDisplay";
import { Card, CardContent } from "@/components/ui/card";

interface GetTokensForAddressData {
    address: string;
    network: string;
    tokens: [
        {
            balance: number;
            symbol: string;
        }
    ];
}

interface TokenData {
    address: string;
    balance: number;
    symbol: string;
}

// utils/truncateAddress.ts
export function truncateAddress(address: string): string {
    if (!address) return '';
    
    const start = address.slice(0, 7);
    const end = address.slice(-5);
    
    return `${start}...${end}`;
  }
  

const DisplayTokens: React.FC = () => {
    const { isUnlocked, seedphrase, selectedProtocol, selectedAccount, selectedNetwork, isLoading } = useContext(WalletContext);
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const { createToast } = useToast();

    useEffect(() => {
        const fetchAndSetTokenData = async () => {
            if (isUnlocked && seedphrase && selectedProtocol && selectedAccount && selectedNetwork) {
                try {
                    console.log("DisplayTokens: Starting token data fetch.");

                    // Derive HD node
                    const hdNode = deriveHDNode(seedphrase.join(" "), selectedAccount.path);
                    console.log("DisplayTokens: HD node derived.");

                    // Generate public address (mainnet or testnet)
                    const network = selectedNetwork.networkId === "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
                    const address = getBitcoinAddress(hdNode, network);
                    console.log(`DisplayTokens: Generated address - ${address}`);

                    // Fetch token data via the protocol functions
                    // The protocol function returns a structure with tokens array
                    const data = (await callProtocolMethod(selectedProtocol.scriptUrl, "getTokensForAddress", [
                        address,
                        selectedNetwork.networkId,
                    ])) as GetTokensForAddressData;

                    const btcToken = data.tokens.find((t) => t.symbol === "BTC");
                    //const balance = btcToken ? parseInt(btcToken.balance, 10) : 0;
                    const balance = btcToken ? btcToken.balance : 0;
                    const symbol = btcToken ? btcToken.symbol : "N/A";

                    setTokenData({
                        address,
                        balance,
                        symbol,
                    });
                } catch (error) {
                    console.error("DisplayTokens Error:", error);
                    createToast("Failed to load token data.", "error");
                }
            }
        };

        fetchAndSetTokenData();
    }, [isUnlocked, seedphrase, selectedProtocol, selectedAccount, selectedNetwork, createToast]);

    if (isLoading) return <div>Loading...</div>;
    if (!isUnlocked) return <div>Please unlock your wallet.</div>;
    if (!tokenData) return <div>Loading token data...</div>;

    return (
        <div>
            <Card className="mb-2">
                <CardContent className="px-2 py-4 text-center truncate">
                    <span>{truncateAddress(tokenData.address)}</span>
                </CardContent>
            </Card>
            <BalanceDisplay balance={tokenData.balance} />
            {/* <h2>Wallet Information</h2>
            <p>
                <strong>Public Address:</strong> {tokenData.address}
            </p>
            <p>
                <strong>Balance:</strong> {tokenData.balance} {tokenData.symbol}
            </p> */}
        </div>
    );
};

export default DisplayTokens;
