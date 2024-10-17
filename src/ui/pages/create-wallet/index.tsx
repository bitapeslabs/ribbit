import { Box, Text, TextInput, Button } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import BlurAttach from "@/ui/components/shared/BlurAttach";
import { useRef, useState } from "react";
import WizardNavigator, {
  useWizardNavigatorControls,
  WizardNavigatorControlsProps,
} from "@/ui/components/shared/WizardNavigator";
import styles from "./styles.module.css";
import { Form } from "react-aria-components";

import { PasswordStrengthIndicator } from "@/ui/components/base";
import { PasswordFormValidator } from "@/ui/validators";
import { FormEvent, useMemo } from "react";

type WizardPageProps = {
  WizardNavigatorControls: WizardNavigatorControlsProps;
};

const CreatePasswordPage: React.FC<WizardPageProps> = ({
  WizardNavigatorControls,
}) => {
  const blurRef = useRef<HTMLDivElement>(null);

  const { nextStep } = WizardNavigatorControls;

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const formValidationResponse = useMemo(
    () => PasswordFormValidator(password, repeatPassword),
    [password, repeatPassword]
  );

  const handleSubmission = (e: FormEvent<HTMLFormElement>) => {
    return () => {
      e.preventDefault();

      if (formValidationResponse.error_code) {
        return setPasswordError(formValidationResponse.message);
      }

      return nextStep();
    };
  };
  return (
    <Form onSubmit={handleSubmission}>
      <BlurAttach targetRef={blurRef} />
      <Box className={styles.page_container}>
        <Box ref={blurRef}>
          <Box className={styles.wizard_header_container}>
            <Text size="lg">Create a password</Text>
            <Text size="sm" color="dimmed">
              Your password will be used to encrypt your wallet. Make sure you
              remember it.
            </Text>
          </Box>
        </Box>
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          errorControls={{
            error: passwordError,
            setError: setPasswordError,
          }}
          indicator={<PasswordStrengthIndicator password={password} />}
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

export const CreateWallet: React.FC<{}> = () => {
  const WizardNavigatorControls = useWizardNavigatorControls();

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
        <CreatePasswordPage WizardNavigatorControls={WizardNavigatorControls} />

        <Box className={styles.page_container}>
          <Text size="lg">Wallet Created</Text>
          <Text size="sm" color="dimmed">
            Your wallet has been created. Make sure to backup your seed phrase
            and keep it safe.
          </Text>
        </Box>
      </WizardNavigator>
    </PageContainer>
  );
};
