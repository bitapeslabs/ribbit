import { Box } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";
import { useToast } from "@/ui/providers/toast";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "@/ui/state/WalletContext";
import useRequireWallet from "@/ui/hooks/useRequireWallet";
import DisplayTokens from "@/ui/components/wallet/DisplayTokens";
import SendReceiveTabs from "@/ui/components/wallet/SendReceiveTabs";
import ProtocolManager from "@/ui/components/wallet/ProtocolManager";
import AccountManager from "@/ui/components/wallet/AccountManager";
import { Button } from "@/components/ui/button";

export const WalletDashboard: React.FC = () => {
    const { seedphrase, lockWallet, isLoading } = useContext(WalletContext);
    const navigate = useNavigate();
    const { createToast } = useToast();

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
            <div className="relative min-w-[357px] flex flex-col gap-2">
                <AccountManager />
                <DisplayTokens />
                <ProtocolManager />
                <SendReceiveTabs />
                <Button variant={"link"} onClick={handleLock}>Lock Wallet</Button>
            </div>
        </PageContainer>
    );
};
