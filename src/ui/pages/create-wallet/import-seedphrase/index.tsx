import PageContainer from "@/ui/components/shared/PageContainer";
import WizardNavigator, {
  createWizardNavigatorControls,
  useWizardNavigatorControls,
} from "@/ui/components/shared/WizardNavigator";

import { FormFactory } from "../shared";
import { Box, TextInput, Text, Button, Grid } from "@/ui/components/base";
import { CreatePasswordPage } from "../shared";
import { Form } from "react-aria-components";
import { useState } from "react";
import { useToast } from "@/ui/providers/toast";

import styles from "../styles.module.css";

const ImportSeedphrasePage: React.FC<FormFactory<"seedphrase", string[]>> = ({
  seedphrase,
  setSeedphrase,
}) => {
  const { submitAll } = useWizardNavigatorControls();
  const setWord = (index: number, word: string) => {
    setSeedphrase((currentSeedphrase) => {
      const newWordsForm = [...currentSeedphrase];
      newWordsForm[index] = word;
      return newWordsForm;
    });
  };
  return (
    <Form onSubmit={submitAll} className={styles.page_container}>
      <Box className={styles.wizard_header_container}>
        <Text size="lg">Import wallet</Text>
        <Text size="sm" color="dimmed">
          Enter your seedphrase to restore your wallet
        </Text>
      </Box>

      <Grid.Container columns={2} rows={6}>
        {seedphrase.map((currentValue, index) => (
          <Grid.Item index={index + 1} noOutline>
            <TextInput
              type="text"
              key={"remember_input_" + index}
              onChange={(e) => setWord(index, e.target.value)}
              value={currentValue}
            />
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

  const handleSubmission = async (): Promise<void> => {
    createToast("Wallet imported  successfully", "success");
  };

  const WizardNavigatorControls = createWizardNavigatorControls(
    handleSubmission,
    1
  );

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <WizardNavigator WizardNavigatorControls={WizardNavigatorControls}>
        <CreatePasswordPage password={password} setPassword={setPassword} />
        <ImportSeedphrasePage
          seedphrase={seedphrase}
          setSeedphrase={setSeedphrase}
        />
      </WizardNavigator>
    </PageContainer>
  );
};

export default CreateWalletImportSeedphrase;
