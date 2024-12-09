import PageContainer from "@/ui/components/shared/PageContainer";
import WizardNavigator, { createWizardNavigatorControls, useWizardNavigatorControls } from "@/ui/components/shared/WizardNavigator";

import { FormFactory } from "../shared";
import { Box, TextInput, Text, Button, Grid } from "@/ui/components/base";
import { CreatePasswordPage } from "../shared";
import { Form } from "react-aria-components";
import { FormEvent, useState } from "react";
import { useToast } from "@/ui/providers/toast";

import styles from "../styles.module.css";
import { storage } from "@/background/webapi";
import { encrypt } from "@/shared/lib/crypto";
import { useNavigate } from "react-router-dom";

const ImportSeedphrasePage: React.FC<FormFactory<"seedphrase", string[]>> = ({ seedphrase, setSeedphrase }) => {
    const { submitAll } = useWizardNavigatorControls();
    const setWord = (index: number, word: string) => {
        setSeedphrase((currentSeedphrase) => {
            const newWordsForm = [...currentSeedphrase];
            newWordsForm[index] = word;
            return newWordsForm;
        });
    };

    const handleSubmission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        return submitAll();
    };

    return (
        <Form onSubmit={handleSubmission} className={styles.page_container}>
            <Box className={styles.wizard_header_container}>
                <Text size="lg">Import wallet</Text>
                <Text size="sm" color="dimmed">
                    Enter your seedphrase to restore your wallet
                </Text>
            </Box>

            <Grid.Container columns={2} rows={6}>
                {seedphrase.map((currentValue, index) => (
                    <Grid.Item key={`word-${index}`} index={index + 1} noOutline>
                        <TextInput type="text" key={"word_input_" + index} onChange={(e) => setWord(index, e.target.value)} value={currentValue} />
                    </Grid.Item>
                ))}
            </Grid.Container>

            <Button variant="primary" type="submit" isDisabled={false}>
                Continue
            </Button>
        </Form>
    );
};

export const CreateWalletImportSeedphrase: React.FC<{}> = () => {
    let [seedphrase, setSeedphrase] = useState<string[]>(Array(12).fill(""));
    let [password, setPassword] = useState<string>("");

    const { createToast } = useToast();
    const navigate = useNavigate();

    const handleSubmission = async (): Promise<void> => {
        console.log("handleSubmission");
        console.log(password);
        console.log(seedphrase);

        if (!password) {
            createToast("Password is required", "error");
            return;
        }

        const encryptedSeedphrase = await encrypt(password, { seedphrase });
        await storage.set("encrypted_seed", encryptedSeedphrase);

        console.log(encryptedSeedphrase);

        createToast("Wallet imported  successfully", "success");

        // Redirect to the wallet dashboard
        console.log("navigate");
        navigate("/wallet", { replace: true });
        console.log("navigated");
    };

    const WizardNavigatorControls = createWizardNavigatorControls(handleSubmission, 0);

    return (
        <PageContainer hasGradient hasPadding hasBackground>
            <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
                <CreatePasswordPage password={password} setPassword={setPassword} />
                <ImportSeedphrasePage seedphrase={seedphrase} setSeedphrase={setSeedphrase} />
            </WizardNavigator>
        </PageContainer>
    );
};

export default CreateWalletImportSeedphrase;
