import { Box, Text, TextInput, Button, Checkbox } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import { useEffect, useRef, useState } from "react";
import WizardNavigator, { createWizardNavigatorControls, useWizardNavigatorControls } from "@/ui/components/shared/WizardNavigator";
import styles from "../styles.module.css";
import { Form } from "react-aria-components";
import { CreatePasswordPage } from "../shared";
import { FormEvent, useMemo } from "react";
import Grid from "@/ui/components/base/Grid";

import { useToast } from "@/ui/providers/toast";

import { generateMnemonic } from "@/shared/lib/btc/wallet";

import { encrypt } from "@/shared/lib/crypto";

import { storage } from "@/background/webapi";
import { useNavigate } from "react-router-dom";
const TOTAL_WORDS_TO_REMEMBER = 3;

type WordsToRememberProps = Array<{
    writtenIndex: string;
    word: string;
}>;

const writtenIndicies = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

const ConfirmSeedphrasePage: React.FC<{ seedphrase: string[] }> = ({ seedphrase }) => {
    const { submitAll, currentStep } = useWizardNavigatorControls();

    const [wordsForm, setWordsForm] = useState<string[]>(Array.from({ length: TOTAL_WORDS_TO_REMEMBER }, () => ""));

    // Shuffle function using Fisher-Yates algorithm
    const shuffleArray = (array: number[]): number[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    //We want to create a new form every time this page is rendered to avoid people from going back and forth to see seedphrase without having written it down

    const wordsToRemember = useMemo<WordsToRememberProps>(() => {
        // Ensure that TOTAL_WORDS_TO_REMEMBER does not exceed the available indices
        const total = Math.min(TOTAL_WORDS_TO_REMEMBER, writtenIndicies.length);

        // Create an array of indices [0, 1, 2, ..., 11]
        const allIndices = writtenIndicies.map((_, index) => index);

        // Shuffle the indices to randomize their order
        const shuffledIndices = shuffleArray(allIndices);

        // Select the first 'total' indices for uniqueness
        const selectedIndices = shuffledIndices.slice(0, total);

        // Map the selected indices to the words to remember
        const wordsToRemember = selectedIndices.map((index) => ({
            writtenIndex: writtenIndicies[index],
            word: seedphrase[index],
        }));

        return wordsToRemember;
    }, [currentStep, seedphrase]);

    const setWord = (index: number, word: string) => {
        setWordsForm((currentWordsForm) => {
            const newWordsForm = [...currentWordsForm];
            newWordsForm[index] = word;
            return newWordsForm;
        });
    };

    const allWordsMatch = wordsForm.every((word, index) => word === wordsToRemember[index].word);

    const handleSubmission = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        return submitAll();
    };

    return (
        <Form onSubmit={handleSubmission} className={styles.page_container}>
            <Box className={styles.wizard_header_container}>
                <Text size="lg">Confirm your recovery phrase</Text>
            </Box>

            {wordsToRemember.map((wordDetails, index) => (
                <TextInput
                    type="text"
                    key={"remember_input_" + index}
                    onChange={(e) => setWord(index, e.target.value)}
                    value={wordsForm[index]}
                    label={
                        <Text color="secondary" size="sm">
                            What was the <Text color="primary">{wordDetails.writtenIndex}</Text> word?
                        </Text>
                    }
                />
            ))}

            <Button variant="primary" type="submit" isDisabled={allWordsMatch}>
                Continue
            </Button>
        </Form>
    );
};

const ViewSeedphrasePage: React.FC<{ seedphrase: string[] }> = ({ seedphrase }) => {
    const { nextStep } = useWizardNavigatorControls();

    const [confirmAction, setConfirmAction] = useState(false);

    const blurRef = useRef<HTMLDivElement>(null);

    return (
        <Box className={styles.page_container}>
            <Box className={styles.wizard_header_container} ref={blurRef}>
                <Text size="lg">Write down recovery phrase</Text>
                <Text size="sm" color="dimmed">
                    <Text size="sm" color="dimmed">
                        If you lose access to this wallet, this phrase will be the only way to recover your assets
                    </Text>
                </Text>
            </Box>

            <Grid.Container columns={2} rows={6}>
                {seedphrase.map((word, index) => (
                    <Grid.Item key={index} index={index + 1}>
                        <Box className={styles.seedphrase_word}>{word}</Box>
                    </Grid.Item>
                ))}
            </Grid.Container>

            <Box className={styles.checkbox_container}>
                <Checkbox isSelected={confirmAction} onChange={setConfirmAction}>
                    I have written down my seed phrase
                </Checkbox>
            </Box>
            <Button variant="primary" type="submit" isDisabled={!confirmAction} onPress={nextStep}>
                Continue
            </Button>
        </Box>
    );
};

export const CreateWalletNewSeedphrase: React.FC<{}> = () => {
    let [seedphrase, setSeedphrase] = useState<string[]>([]);
    let [password, setPassword] = useState<string>("");

    const { createToast } = useToast();
    const navigate = useNavigate();

    const handleSubmission = async (): Promise<void> => {
        /* @todo: show loading indicator */

        if (!password) {
            createToast("Password is required", "error");
            return;
        }

        const encryptedSeedphrase = await encrypt(password, { seedphrase });
        await storage.set("encrypted_seed", encryptedSeedphrase);

        createToast("Wallet created successfully", "success");
        
        // Redirect to the wallet dashboard
        navigate("/wallet");
    };

    const WizardNavigatorControls = createWizardNavigatorControls(handleSubmission, 0);

    useEffect(() => {
        const GenerateMnemonic = async () => {
            const mnemonic = await generateMnemonic();
            setSeedphrase(mnemonic.split(" "));
        };

        GenerateMnemonic();
    }, []);

    return (
        <PageContainer hasGradient hasPadding hasBackground>
            <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
                <CreatePasswordPage password={password} setPassword={setPassword} />
                <ViewSeedphrasePage seedphrase={seedphrase} />
                <ConfirmSeedphrasePage seedphrase={seedphrase} />
            </WizardNavigator>
        </PageContainer>
    );
};

export default CreateWalletNewSeedphrase;
