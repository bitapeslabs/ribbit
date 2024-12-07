import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface WalletContextProps {
  isUnlocked: boolean;
  seedphrase: string[] | null;
  isLoading: boolean; // New state
  unlockWallet: (seed: string[]) => void;
  lockWallet: () => void;
}

export const WalletContext = createContext<WalletContextProps>({
  isUnlocked: false,
  seedphrase: null,
  isLoading: true, // Initialize as loading
  unlockWallet: () => {},
  lockWallet: () => {},
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [seedphrase, setSeedphrase] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Manage loading state

  useEffect(() => {
    const fetchSeedphrase = async () => {
      try {
        const unlocked = sessionStorage.getItem('wallet_unlocked') === 'true';
        const storedSeed = sessionStorage.getItem('decrypted_seed');

        if (unlocked && storedSeed) {
          setSeedphrase(JSON.parse(storedSeed));
          setIsUnlocked(true);
        }
      } catch (error) {
        console.error('Error initializing wallet context:', error);
      } finally {
        setIsLoading(false); // Initialization complete
      }
    };

    fetchSeedphrase();
  }, []);

  const unlockWallet = (seed: string[]) => {
    setSeedphrase(seed);
    setIsUnlocked(true);
    sessionStorage.setItem('wallet_unlocked', 'true');
    sessionStorage.setItem('decrypted_seed', JSON.stringify(seed));
  };

  const lockWallet = () => {
    setSeedphrase(null);
    setIsUnlocked(false);
    sessionStorage.removeItem('wallet_unlocked');
    sessionStorage.removeItem('decrypted_seed');
  };

  return (
    <WalletContext.Provider value={{ isUnlocked, seedphrase, isLoading, unlockWallet, lockWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
