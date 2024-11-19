import * as passworder from "@metamask/browser-passworder";

const bufferToHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export const hash = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
};
export const encrypt = (password: string, data: any): Promise<string> => {
  return passworder.encrypt(password, data);
};

export const decrypt = (password: string, blob: string): Promise<any> => {
  return passworder.decrypt(password, blob);
};
