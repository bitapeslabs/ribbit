// src/components/UnlockWallet.tsx
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "@/ui/state/WalletContext";
import { useToast } from "@/ui/providers/toast";
import { decrypt } from "@/shared/lib/crypto";
import { storage } from "@/background/webapi";
import PageContainer from "@/ui/components/shared/PageContainer";
import { Text, TextInput } from "@/ui/components/base";
import { Button } from "@/components/ui/button";

export const UnlockWallet: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    const { unlockWallet } = useContext(WalletContext);
    const { createToast } = useToast();

    const handleUnlock = async () => {
        try {
            const encryptedSeed = await storage.get("encrypted_seed");
            if (!encryptedSeed) {
                createToast("No wallet found. Please create a new wallet.", "error");
                navigate("/create-wallet");
                return;
            }

            const decryptedData = await decrypt(password, encryptedSeed);
            const seedphrase = decryptedData.seedphrase;

            if (!seedphrase || !Array.isArray(seedphrase)) {
                throw new Error("Invalid seed phrase format.");
            }

            // Update the context to indicate the wallet is unlocked
            unlockWallet(seedphrase);

            createToast("Wallet unlocked successfully!", "success");

            // Redirect to the intended page or wallet dashboard
            const from = (location.state as any)?.from?.pathname || "/wallet";
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Error unlocking wallet:", error);
            createToast("Failed to unlock wallet. Incorrect password.", "error");
        }
    };

    return (
        <PageContainer hasGradient hasPadding hasBackground>
          <div className="flex flex-col gap-2">

            <Text size="lg">Unlock Wallet</Text>
            <TextInput type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {/* <button onClick={handleUnlock}>Unlock Wallet</button> */}
            <Button variant={"default"} size={"lg"} className="bg-[#7bff5c] hover:bg-[#76ec5b]" onClick={handleUnlock}>
                Unlock Wallet
            </Button>
          </div>
        </PageContainer>
    );
};
