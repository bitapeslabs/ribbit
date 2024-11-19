import { browserStorageLocalGet, browserStorageLocalSet } from "./browser";
import { isInDevEnvironment } from "./browser";

let cacheMap: Map<string, any> | undefined;

const IS_DEV = isInDevEnvironment();
const get = async (prop?: string): Promise<any> => {
  if (cacheMap) {
    return prop ? cacheMap.get(prop) : Object.fromEntries(cacheMap);
  }

  if (IS_DEV) {
    const entries = Object.entries(localStorage);
    cacheMap = new Map(entries);

    return prop ? cacheMap.get(prop) : Object.fromEntries(cacheMap);
  }

  const result = await browserStorageLocalGet(null);
  cacheMap = new Map<string, any>(Object.entries(result || {}));

  return prop ? cacheMap.get(prop) : result;
};

const set = async (prop: string, value: string): Promise<void> => {
  if (cacheMap) {
    cacheMap.set(prop, value);
  } else {
    cacheMap = new Map<string, any>([[prop, value]]);
  }

  if (IS_DEV) {
    //use instead of chrome api which is not available in dev environment

    localStorage.setItem(prop, value);
    return;
  }

  await browserStorageLocalSet({ [prop]: value });
};

const byteInUse = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.getBytesInUse((value) => {
        resolve(value);
      });
    } else {
      reject("ByteInUse only works in Chrome");
    }
  });
};

export default {
  get,
  set,
  byteInUse,
};
