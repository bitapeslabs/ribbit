import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

/* Wallet creation */
export const generateMnemonic = () => bip39.generateMnemonic(wordlist);
export const validateMnemonic = (mnemonic: string) =>
  bip39.validateMnemonic(mnemonic, wordlist);
