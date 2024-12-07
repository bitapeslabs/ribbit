import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WalletContext } from '../state/WalletContext';
import { useToast } from '../providers/toast';

const useRequireWallet = () => {
    const { isUnlocked, isLoading } = useContext(WalletContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { createToast } = useToast();
  
    useEffect(() => {
      if (!isLoading) { // Only proceed if not loading
        if (!isUnlocked) {
          createToast('Please unlock your wallet to continue.', 'warning');
          navigate('/unlock-wallet', { state: { from: location }, replace: true });
        }
      }
    }, [isUnlocked, isLoading, navigate, location, createToast]);
  };
  
  export default useRequireWallet;
