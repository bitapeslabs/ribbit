// src/components/UnlockWallet.tsx
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WalletContext } from '@/ui/state/WalletContext';
import { useToast } from '@/ui/providers/toast';
import { decrypt } from '@/shared/lib/crypto';
import { storage } from '@/background/webapi';

export const UnlockWallet: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { unlockWallet } = useContext(WalletContext);
    const { createToast } = useToast();
  
    const handleUnlock = async () => {
      try {
        const encryptedSeed = await storage.get('encrypted_seed');
        if (!encryptedSeed) {
          createToast('No wallet found. Please create a new wallet.', 'error');
          navigate('/create-wallet');
          return;
        }
  
        const decryptedData = await decrypt(password, encryptedSeed);
        const seedphrase = decryptedData.seedphrase;
  
        if (!seedphrase || !Array.isArray(seedphrase)) {
          throw new Error('Invalid seed phrase format.');
        }
  
        // Update the context to indicate the wallet is unlocked
        unlockWallet(seedphrase);
  
        createToast('Wallet unlocked successfully!', 'success');
  
        // Redirect to the intended page or wallet dashboard
        const from = (location.state as any)?.from?.pathname || '/wallet';
        navigate(from, { replace: true });
      } catch (error) {
        console.error('Error unlocking wallet:', error);
        createToast('Failed to unlock wallet. Incorrect password.', 'error');
      }
    };
  
    return (
      <div className="unlock-wallet-container">
        <h2>Unlock Your Wallet</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button onClick={handleUnlock}>Unlock Wallet</button>
      </div>
    );
  };