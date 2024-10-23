import * as passworder from "@metamask/browser-passworder";

export const encrypt = (password: string, data: any): Promise<string> => {
  return passworder.encrypt(password, data);
};

export const decrypt = (password: string, blob: string): Promise<any> => {
  return passworder.decrypt(password, blob);
};
