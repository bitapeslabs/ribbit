import { MANIFEST_VERSION } from "@/shared/constants";

function getBrowser() {
  if (typeof (globalThis as any).browser === "undefined") {
    return chrome;
  } else {
    return (globalThis as any).browser;
  }
}

const browser = getBrowser();
console.log("BROWSER: ");
console.log(browser);
export async function browserWindowsGetCurrent(params?: any) {
  //@ts-ignore

  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.windows.getCurrent(params, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.windows.getCurrent(params);
  }
}

export function isInDevEnvironment(): boolean {
  return (
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
  );
}

export async function browserWindowsCreate(params?: any) {
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.windows.create(params, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.windows.create(params);
  }
}

export async function browserWindowsUpdate(windowId: number, updateInfo: any) {
  //@ts-ignore

  if (MANIFEST_VERSION == "mv2") {
    return new Promise((resolve, _) => {
      browser.windows.update(windowId, updateInfo, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.windows.update(windowId, updateInfo);
  }
}

export async function browserWindowsRemove(windowId: number) {
  //@ts-ignore

  if (MANIFEST_VERSION == "mv2") {
    return new Promise((resolve, _) => {
      browser.windows.remove(windowId, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.windows.remove(windowId);
  }
}

export async function browserStorageLocalGet(val: any) {
  //@ts-ignore

  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.storage.local.get(val, (res: any) => {
        resolve(res);
      });
    });
  } else {
    return await browser.storage.local.get(val);
  }
}

export async function browserStorageLocalSet(val: any) {
  //@ts-ignore

  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.storage.local.set(val, (res: any) => {
        resolve(res);
      });
    });
  } else {
    return await browser.storage.local.set(val);
  }
}

export async function browserTabsGetCurrent() {
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.tabs.getCurrent((val: any) => {
        resolve(val);
      });
    });
  } else {
    try {
      return await browser.tabs.getCurrent();
    } catch (e) {
      //Probably running in a dev environment with vite

      return null;
    }
  }
}

export async function browserTabsQuery(params: any) {
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.tabs.query(params, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.tabs.query(params);
  }
}

export async function browserTabsCreate(params: any) {
  //@ts-ignore

  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.tabs.create(params, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.tabs.create(params);
  }
}

export async function browserTabsUpdate(tabId: number, params: any) {
  //@ts-ignore

  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve, _) => {
      browser.tabs.update(tabId, params, (val: any) => {
        resolve(val);
      });
    });
  } else {
    return await browser.tabs.update(tabId, params);
  }
}

export function browserWindowsOnFocusChanged(listener: Function) {
  browser.windows.onFocusChanged.addListener(listener);
}

export function browserWindowsOnRemoved(listener: Function) {
  browser.windows.onRemoved.addListener(listener);
}

export function browserTabsOnUpdated(listener: Function) {
  browser.tabs.onUpdated.addListener(listener);
}

export function browserTabsOnRemoved(listener: Function) {
  browser.tabs.onRemoved.addListener(listener);
}

export function browserRuntimeOnConnect(listener: Function) {
  browser.runtime.onConnect.addListener(listener);
}

export function browserRuntimeOnInstalled(listener: Function) {
  browser.runtime.onInstalled.addListener(listener);
}

export function browserRuntimeConnect(extensionId?: string, connectInfo?: any) {
  return browser.runtime.connect(extensionId, connectInfo);
}

export default browser;
