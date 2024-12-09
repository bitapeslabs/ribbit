// src/context/WalletContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Protocol {
    name: string;
    logo: string;
    bip44: number;
    scriptUrl: string;
    networks: NetworkConfig[];
}

export interface NetworkConfig {
  name: string;
  networkId: string;
  bip44: number;
}

export interface Account {
    name: string;
    path: string;
}

interface WalletContextProps {
    isUnlocked: boolean;
    seedphrase: string[] | null;
    isLoading: boolean;
    protocols: Protocol[];
    selectedProtocol: Protocol | null;
    selectedNetwork: NetworkConfig | null;
    selectProtocol: (protocol: Protocol) => void;
    selectNetwork: (network: NetworkConfig) => void;
    addProtocol: (protocol: Protocol) => void;
    accounts: Account[];
    selectedAccount: Account | null;
    selectAccount: (account: Account) => void;
    addAccount: () => void;
    unlockWallet: (seed: string[]) => void;
    lockWallet: () => void;
}

export const WalletContext = createContext<WalletContextProps>({
    isUnlocked: false,
    seedphrase: null,
    isLoading: true,
    protocols: [],
    selectedProtocol: null,
    selectedNetwork: null,
    selectProtocol: () => {},
    selectNetwork: () => {},
    addProtocol: () => {},
    accounts: [],
    selectedAccount: null,
    selectAccount: () => {},
    addAccount: () => {},
    unlockWallet: () => {},
    lockWallet: () => {},
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
    const [seedphrase, setSeedphrase] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    useEffect(() => {
        const initializeWallet = () => {
            try {
                // Load protocols from localStorage
                const storedProtocols = JSON.parse(localStorage.getItem('protocols') || '[]') as Protocol[];
                setProtocols(storedProtocols);
                console.log('WalletContext: Loaded protocols from localStorage.', storedProtocols);

                // Load wallet state from sessionStorage
                const unlocked = sessionStorage.getItem('wallet_unlocked') === 'true';
                const storedSeed = sessionStorage.getItem('decrypted_seed');
                const storedSelectedProtocol = JSON.parse(sessionStorage.getItem('selected_protocol') || 'null') as Protocol | null;
                const storedSelectedNetwork = JSON.parse(sessionStorage.getItem('selected_network') || 'null') as NetworkConfig | null;

                if (unlocked && storedSeed) {
                    const parsedSeed = JSON.parse(storedSeed) as string[];
                    if (Array.isArray(parsedSeed)) {
                        setSeedphrase(parsedSeed);
                        setIsUnlocked(true);
                        console.log('WalletContext: Wallet is unlocked from sessionStorage.');
                    } else {
                        console.warn('WalletContext: Stored seed phrase is not an array.');
                    }
                }

                let protocolToUse = storedSelectedProtocol ? storedProtocols.find(p => p.name === storedSelectedProtocol.name) : null;
                if (!protocolToUse && storedProtocols.length > 0) {
                    protocolToUse = storedProtocols[0];
                }
                setSelectedProtocol(protocolToUse || null);

                let networkToUse = null;
                if (protocolToUse) {
                    if (storedSelectedNetwork && protocolToUse.networks.find(n => n.networkId === storedSelectedNetwork.networkId)) {
                        networkToUse = protocolToUse.networks.find(n => n.networkId === storedSelectedNetwork.networkId)!;
                    } else if (protocolToUse.networks.length > 0) {
                        networkToUse = protocolToUse.networks[0];
                    }
                }
                setSelectedNetwork(networkToUse || null);

                // Initialize default account
                if (protocolToUse && networkToUse) {
                    const defaultAccount: Account = { name: 'Account 1', path: `m/84'/${networkToUse.bip44}'/0'/0/0` };
                    setAccounts([defaultAccount]);
                    setSelectedAccount(defaultAccount);
                }
                console.log('WalletContext: Initialization complete.');
            } catch (error) {
                console.error('WalletContext Initialization Error:', error);
            } finally {
                setIsLoading(false);
                console.log('WalletContext: isLoading set to false.');
            }
        };

        initializeWallet();
    }, []);

    // Persist selected protocol and network in sessionStorage
    useEffect(() => {
        if (selectedProtocol) {
            sessionStorage.setItem('selected_protocol', JSON.stringify(selectedProtocol));
            console.log('WalletContext: Selected protocol saved to sessionStorage.', selectedProtocol);
        }
    }, [selectedProtocol]);

    useEffect(() => {
        if (selectedNetwork) {
            sessionStorage.setItem('selected_network', JSON.stringify(selectedNetwork));
            console.log('WalletContext: Selected network saved to sessionStorage.', selectedNetwork);
        }
    }, [selectedNetwork]);

    const selectProtocol = (protocol: Protocol) => {
        setSelectedProtocol(protocol);
        console.log(`WalletContext: Protocol selected - ${protocol.name}`);
        // Select default network
        if (protocol.networks.length > 0) {
            selectNetwork(protocol.networks[0]);
        } else {
            setAccounts([]);
            setSelectedAccount(null);
        }
    };

    const selectNetwork = (network: NetworkConfig) => {
        setSelectedNetwork(network);
        console.log(`WalletContext: Network selected - ${network.name}`);
        // Reset accounts based on new network's bip44
        const defaultAccount: Account = { name: 'Account 1', path: `m/84'/${network.bip44}'/0'/0/0` };
        setAccounts([defaultAccount]);
        setSelectedAccount(defaultAccount);
    };

    const addProtocol = (protocol: Protocol) => {
        setProtocols(prev => [...prev, protocol]);
        console.log(`WalletContext: Protocol added - ${protocol.name}`);
    };

    const addAccount = () => {
        if (!selectedNetwork) return;
        const newAccountNumber = accounts.length + 1;
        const newAccount: Account = {
            name: `Account ${newAccountNumber}`,
            path: `m/84'/${selectedNetwork.bip44}'/${newAccountNumber - 1}'/0/0`,
        };
        setAccounts(prev => [...prev, newAccount]);
        setSelectedAccount(newAccount);
        console.log(`WalletContext: Account added - ${newAccount.name}`);
    };

    const selectAccount = (account: Account) => {
        setSelectedAccount(account);
        console.log(`WalletContext: Account selected - ${account.name}`);
    };

    const unlockWallet = (seed: string[]) => {
        setSeedphrase(seed);
        setIsUnlocked(true);
        sessionStorage.setItem('wallet_unlocked', 'true');
        sessionStorage.setItem('decrypted_seed', JSON.stringify(seed));
        console.log('WalletContext: Wallet unlocked.');
    };

    const lockWallet = () => {
        setSeedphrase(null);
        setIsUnlocked(false);
        sessionStorage.removeItem('wallet_unlocked');
        sessionStorage.removeItem('decrypted_seed');
        console.log('WalletContext: Wallet locked.');
    };

    return (
        <WalletContext.Provider value={{
            isUnlocked,
            seedphrase,
            isLoading,
            protocols,
            selectedProtocol,
            selectedNetwork,
            selectProtocol,
            selectNetwork,
            addProtocol,
            accounts,
            selectedAccount,
            selectAccount,
            addAccount,
            unlockWallet,
            lockWallet,
        }}>
            {children}
        </WalletContext.Provider>
    );
};
