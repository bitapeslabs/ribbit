import React, { FormEvent, useMemo, useRef, useState } from "react";
import { Box, Button, Text, TextInput } from "@/ui/components/base";
import { useWizardNavigatorControls } from "@/ui/components/shared/WizardNavigator";
import { PasswordFormValidator } from "@/ui/validators";
import { PasswordStrengthIndicator } from "@/ui/components/base";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import styles from "./styles.module.css";
import { Form } from "react-aria-components";

export const CreatePasswordPage: React.FC<FormFactory<"password", string>> = ({
  password,
  setPassword,
}) => {
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

export type FormFactory<T extends string, S> = {
  [K in T]: S;
} & {
  [K in `set${Capitalize<T>}`]: React.Dispatch<React.SetStateAction<S>>;
};
