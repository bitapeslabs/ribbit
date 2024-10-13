import { browserStorageLocalGet, browserStorageLocalSet } from "./browser";

let cacheMap: Map<string, any> | undefined;

const get = async (prop?: string): Promise<any> => {
  if (cacheMap) {
    return prop ? cacheMap.get(prop) : cacheMap;
  }

  const result = await browserStorageLocalGet(null);
  cacheMap = new Map<string, any>(Object.entries(result));

  return prop ? result[prop] : result;
};

const set = async (prop: string, value: any): Promise<void> => {
  await browserStorageLocalSet({ [prop]: value });
  if (cacheMap) {
    cacheMap.set(prop, value);
  } else {
    cacheMap = new Map<string, any>([[prop, value]]);
  }
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
