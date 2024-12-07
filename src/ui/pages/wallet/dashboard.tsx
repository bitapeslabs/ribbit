import { Box } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";
import { useToast } from "@/ui/providers/toast";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { WalletContext } from "@/ui/state/WalletContext";
import useRequireWallet from "@/ui/hooks/useRequireWallet";

export const WalletDashboard: React.FC = () => {
    const { seedphrase, lockWallet, isLoading } = useContext(WalletContext);
    const navigate = useNavigate();
    const { createToast } = useToast();

    // Invoke the custom hook to protect this component
    useRequireWallet();

    const handleLock = async () => {
        lockWallet();
        createToast("Wallet locked successfully.", "success");
        navigate("/unlock-wallet");
    };

    if (isLoading || !seedphrase) {
        return <div>Loading wallet...</div>;
    }

    return (
        <PageContainer hasGradient hasPadding hasBackground>
            <Box className={styles.container}>
                <h1>Your Wallet Dashboard</h1>
                {/* Display wallet information here */}
                <p>Your seed phrase is securely stored.</p>
                {/* Add more wallet functionalities as needed */}
                <button onClick={handleLock}>Lock Wallet</button>
            </Box>
        </PageContainer>
    );
};
