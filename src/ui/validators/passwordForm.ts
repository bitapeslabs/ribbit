import { PasswordValidator } from "./password";
import { SuccessResponse, ValidatorResponse } from "./shared";

export const PasswordFormValidator = (
  password: string,
  repeatPassword: string
): ValidatorResponse => {
  const validPasswordResult = PasswordValidator(password);

  if (validPasswordResult.error_code !== 0) {
    return validPasswordResult;
  }

  if (password !== repeatPassword) {
    return {
      message: "Passwords do not match",
      error_code: 4,
    };
  }

  return SuccessResponse;
};

export default PasswordFormValidator;
