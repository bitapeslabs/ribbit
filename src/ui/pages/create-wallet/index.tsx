import { Box, Text, TextInput, Button, Checkbox } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import { useEffect, useRef, useState } from "react";
import WizardNavigator, {
  createWizardNavigatorControls,
  useWizardNavigatorControls,
} from "@/ui/components/shared/WizardNavigator";
import styles from "./styles.module.css";
import { Form } from "react-aria-components";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { PasswordStrengthIndicator } from "@/ui/components/base";
import { PasswordFormValidator } from "@/ui/validators";
import { FormEvent, useMemo } from "react";
import { SeedphraseGrid } from "@/ui/components/shared/SeedphraseGrid";

import { useToast } from "@/ui/providers/toast";

import { generateMnemonic } from "@/shared/lib/btc/wallet";

import { encrypt } from "@/shared/lib/crypto";

import { storage } from "@/background/webapi";
const TOTAL_WORDS_TO_REMEMBER = 3;

type WordsToRememberProps = Array<{
  writtenIndex: string;
  word: string;
}>;

const writtenIndicies = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
];

const ConfirmSeedphrasePage: React.FC<{ seedphrase: string[] }> = ({
  seedphrase,
}) => {
  const { submitAll, currentStep } = useWizardNavigatorControls();

  const [wordsForm, setWordsForm] = useState<string[]>(
    Array.from({ length: TOTAL_WORDS_TO_REMEMBER }, () => "")
  );

  //We want to create a new form every time this page is rendered to avoid people from going back and forth to see seedphrase without having written it down

  const wordsToRemember = useMemo<WordsToRememberProps>(() => {
    const wordsToRemember = Array.from(
      { length: TOTAL_WORDS_TO_REMEMBER },
      () => Math.floor(Math.random() * 12)
    ).map((index) => ({
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

  const allWordsMatch = wordsForm.every(
    (word, index) => word === wordsToRemember[index].word
  );

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
              What was the{" "}
              <Text color="primary">{wordDetails.writtenIndex}</Text> word?
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

const CreatePasswordPage: React.FC<{
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}> = ({ password, setPassword }) => {
  const blurRef = useRef<HTMLDivElement>(null);

  const { nextStep } = useWizardNavigatorControls();

  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const formValidationResponse = useMemo(
    () => PasswordFormValidator(password, repeatPassword),
    [password, repeatPassword]
  );

  const handleSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formValidationResponse.error_code) {
      return setPasswordError(formValidationResponse.message);
    }

    return nextStep();
  };
  return (
    <Form onSubmit={handleSubmission} className={styles.page_container}>
      <Box ref={blurRef}>
        <Box className={styles.wizard_header_container}>
          <Text size="lg">Create a password</Text>
          <Text size="sm" color="dimmed">
            This is the password will be used to encrypt your wallet. Make sure
            you remember it.
            <br />
            <br />
            Your password needs to have has at least{" "}
            <Text size="sm" color="secondary">
              one uppercase and lowercase letter, one symbol and be atleast 8
              characters long
            </Text>
          </Text>
        </Box>
      </Box>
      <TextInput
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        errorControls={{
          error: passwordError,
          setError: setPasswordError,
        }}
        indicator={
          <Box className={styles.indicator_container}>
            <PasswordStrengthIndicator password={password} />
            <Box
              className={styles.password_visibility_toggle}
              onClick={() =>
                setShowPassword((currentShowPassword) => !currentShowPassword)
              }
            >
              {showPassword ? (
                <IconEyeOff size="18px" />
              ) : (
                <IconEye size="18px" />
              )}
            </Box>
          </Box>
        }
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextInput
        type="password"
        placeholder="Repeat Password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      <Button
        variant="primary"
        type="submit"
        isDisabled={formValidationResponse.error_code !== 0}
      >
        Continue
      </Button>
    </Form>
  );
};

const ViewSeedphrasePage: React.FC<{ seedphrase: string[] }> = ({
  seedphrase,
}) => {
  const { nextStep } = useWizardNavigatorControls();

  const [confirmAction, setConfirmAction] = useState(false);

  const blurRef = useRef<HTMLDivElement>(null);

  return (
    <Box className={styles.page_container}>
      <Box className={styles.wizard_header_container} ref={blurRef}>
        <Text size="lg">Write down recovery phrase</Text>
        <Text size="sm" color="dimmed">
          <Text size="sm" color="dimmed">
            If you lose access to this wallet, this phrase will be the only way
            to recover your assets
          </Text>
        </Text>
      </Box>

      <SeedphraseGrid seedphrase={seedphrase} />
      <Box className={styles.checkbox_container}>
        <Checkbox isSelected={confirmAction} onChange={setConfirmAction}>
          I have written down my seed phrase
        </Checkbox>
      </Box>
      <Button
        variant="primary"
        type="submit"
        isDisabled={!confirmAction}
        onPress={nextStep}
      >
        Continue
      </Button>
    </Box>
  );
};

export const CreateWallet: React.FC<{}> = () => {
  let [seedphrase, setSeedphrase] = useState<string[]>([]);
  let [password, setPassword] = useState<string>("");

  const { createToast } = useToast();

  const handleSubmission = async (): Promise<void> => {
    const encryptedSeedphrase = await encrypt("yo", { seedphrase });
    await storage.set("seed", encryptedSeedphrase);

    createToast("Wallet created successfully", "success");
  };

  const WizardNavigatorControls = createWizardNavigatorControls(
    handleSubmission,
    2
  );

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
