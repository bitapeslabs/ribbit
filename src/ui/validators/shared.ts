export type ValidatorResponse = {
  message: string;

  /*
    Validator performs many checks in sequence. The error_code is the index of the check that failed. If 0,
    the check passed
  */
  error_code: number;
};

export const SuccessResponse: ValidatorResponse = {
  message: "success",
  error_code: 0,
};

//Global validator utils
export const hasSymbol = (str: string): boolean => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
};
