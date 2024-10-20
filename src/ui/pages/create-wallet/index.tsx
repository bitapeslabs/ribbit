import { Box, Text, TextInput, Button, Checkbox } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import { useEffect, useRef, useState } from "react";
import WizardNavigator, {
  useWizardNavigatorControls,
  WizardNavigatorControlsProps,
} from "@/ui/components/shared/WizardNavigator";
import styles from "./styles.module.css";
import { Form } from "react-aria-components";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { PasswordStrengthIndicator } from "@/ui/components/base";
import { PasswordFormValidator } from "@/ui/validators";
import { FormEvent, useMemo } from "react";
import { SeedphraseGrid } from "@/ui/components/shared/SeedphraseGrid";

const generateMnemonic = async () => {
  return "arm elbow elephant hat apple banana cat dog elephant fish goat hat";
};

type WizardPageProps = {
  WizardNavigatorControls: WizardNavigatorControlsProps;
};

const ConfirmSeedphrasePage: React.FC<WizardPageProps> = ({
  WizardNavigatorControls,
}) => {
  const { nextStep } = WizardNavigatorControls;

  const wordsToRemember = {
    first: "arm",
    ninth: "hat",
    fifth: "elephant",
  };

  return (
    <Box className={styles.page_container}>
      <Box className={styles.wizard_header_container}>
        <Text size="lg">Confirm your recovery phrase</Text>
      </Box>

      {Object.keys(wordsToRemember).map((writtenIndexOfWord, index) => (
        <TextInput
          type="text"
          key={"remember_input_" + index}
          label={
            <Text color="secondary" size="sm">
              What was the <Text color="primary">{writtenIndexOfWord}</Text>{" "}
              word?
            </Text>
          }
        />
      ))}

      <Button variant="primary" type="submit" onPress={nextStep}>
        Continue
      </Button>
    </Box>
  );
};

const CreatePasswordPage: React.FC<WizardPageProps> = ({
  WizardNavigatorControls,
}) => {
  const blurRef = useRef<HTMLDivElement>(null);

  const { nextStep } = WizardNavigatorControls;

  const [password, setPassword] = useState("");
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
    <Form onSubmit={handleSubmission}>
      <Box className={styles.page_container}>
        <Box ref={blurRef}>
          <Box className={styles.wizard_header_container}>
            <Text size="lg">Create a password</Text>
            <Text size="sm" color="dimmed">
              This is the password will be used to encrypt your wallet. Make
              sure you remember it.
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
      </Box>
    </Form>
  );
};

const ViewSeedphrasePage: React.FC<WizardPageProps> = ({
  WizardNavigatorControls,
}) => {
  const { nextStep } = WizardNavigatorControls;

  const [confirmAction, setConfirmAction] = useState(false);

  const blurRef = useRef<HTMLDivElement>(null);

  let [seedphrase, setSeedphrase] = useState<string[]>([]);

  useEffect(() => {
    const GenerateMnemonic = async () => {
      const mnemonic = await generateMnemonic();
      setSeedphrase(mnemonic.split(" "));
    };

    GenerateMnemonic();
  }, []);

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
  const WizardNavigatorControls = useWizardNavigatorControls();

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
        <CreatePasswordPage WizardNavigatorControls={WizardNavigatorControls} />
        <ViewSeedphrasePage WizardNavigatorControls={WizardNavigatorControls} />
        <ConfirmSeedphrasePage
          WizardNavigatorControls={WizardNavigatorControls}
        />
      </WizardNavigator>
    </PageContainer>
  );
};
