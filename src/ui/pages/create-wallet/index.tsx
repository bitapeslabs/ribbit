import { Box, Text, TextInput, Button } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import BlurAttach from "@/ui/components/shared/BlurAttach";
import { useRef, useState } from "react";
import WizardNavigator, {
  useWizardNavigatorControls,
} from "@/ui/components/shared/WizardNavigator";
import styles from "./styles.module.css";
import { Form } from "react-aria-components";
import { functionSubmit } from "@/ui/hooks/utils";

export const CreateWallet: React.FC<{}> = () => {
  const blurRef = useRef<HTMLDivElement>(null);

  const WizardNavigatorControls = useWizardNavigatorControls();

  const { nextStep } = WizardNavigatorControls;

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <BlurAttach targetRef={blurRef} />
      <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
        <Form onSubmit={(e) => functionSubmit(e, nextStep)}>
          <Box className={styles.page_container}>
            <Box ref={blurRef}>
              <Box className={styles.wizard_header_container}>
                <Text size="lg">Create a password</Text>
                <Text size="sm" color="dimmed">
                  Your password will be used to encrypt your wallet. Make sure
                  you remember it.
                </Text>
              </Box>
            </Box>
            <TextInput
              type="password"
              placeholder="Password"
              value={password}
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
              isDisabled={password.length === 0 || password !== repeatPassword}
            >
              Create Wallet
            </Button>
          </Box>
        </Form>

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
