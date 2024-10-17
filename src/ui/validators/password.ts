import { ValidatorResponse, SuccessResponse, hasSymbol } from "./shared";

export const PasswordValidator = (password: string): ValidatorResponse => {
  if (password.length < 8) {
    return {
      message: "Password must be at least 8 characters long",
      error_code: 1,
    };
  }

  if (
    password.toLowerCase() === password ||
    password.toUpperCase() === password
  ) {
    return {
      message: "Password must include both upper and lower case characters",
      error_code: 2,
    };
  }

  //password includes a symbol and no spaces
  if (!hasSymbol(password) || password.includes(" ")) {
    return {
      message: "Password must include both upper and lower case characters",
      error_code: 3,
    };
  }

  return SuccessResponse;
};

export default PasswordValidator;
