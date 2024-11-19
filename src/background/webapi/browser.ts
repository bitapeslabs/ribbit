import { MANIFEST_VERSION } from "@/shared/constants";

function getBrowser() {
  if (isInDevEnvironment()) {
    return null; // Return null in development environment.
  }

  if (typeof (globalThis as any).browser === "undefined") {
    return chrome;
  } else {
    return (globalThis as any).browser;
  }
}

const browser = getBrowser();
console.log("BROWSER: ", browser);

export function isInDevEnvironment(): boolean {
  return (
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
  );
}

async function noOpPromise<T = unknown>(value?: T): Promise<T | undefined> {
  return Promise.resolve(value);
}

// Wrapper for browser methods with fallback for development environments.
export async function browserWindowsGetCurrent(params?: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.windows.getCurrent(params, (val: any) => resolve(val));
    });
  } else {
    return await browser.windows.getCurrent(params);
  }
}

export async function browserWindowsCreate(params?: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.windows.create(params, (val: any) => resolve(val));
    });
  } else {
    return await browser.windows.create(params);
  }
}

export async function browserWindowsUpdate(windowId: number, updateInfo: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.windows.update(windowId, updateInfo, (val: any) => resolve(val));
    });
  } else {
    return await browser.windows.update(windowId, updateInfo);
  }
}

export async function browserWindowsRemove(windowId: number) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.windows.remove(windowId, (val: any) => resolve(val));
    });
  } else {
    return await browser.windows.remove(windowId);
  }
}

export async function browserStorageLocalGet(val: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.storage.local.get(val, (res: any) => resolve(res));
    });
  } else {
    return await browser.storage.local.get(val);
  }
}

export async function browserStorageLocalSet(val: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.storage.local.set(val, (res: any) => resolve(res));
    });
  } else {
    return await browser.storage.local.set(val);
  }
}

export async function browserTabsGetCurrent() {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.tabs.getCurrent((val: any) => resolve(val));
    });
  } else {
    try {
      return await browser.tabs.getCurrent();
    } catch {
      return null; // Handle dev environment gracefully.
    }
  }
}

export async function browserTabsQuery(params: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise([]);
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.tabs.query(params, (val: any) => resolve(val));
    });
  } else {
    return await browser.tabs.query(params);
  }
}

export async function browserTabsCreate(params: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.tabs.create(params, (val: any) => resolve(val));
    });
  } else {
    return await browser.tabs.create(params);
  }
}

export async function browserTabsUpdate(tabId: number, params: any) {
  if (isInDevEnvironment() || !browser) return noOpPromise();
  //@ts-ignore
  if (MANIFEST_VERSION === "mv2") {
    return new Promise((resolve) => {
      browser.tabs.update(tabId, params, (val: any) => resolve(val));
    });
  } else {
    return await browser.tabs.update(tabId, params);
  }
}

export function browserWindowsOnFocusChanged(listener: Function) {
  if (!browser) return;
  browser.windows.onFocusChanged.addListener(listener);
}

export function browserWindowsOnRemoved(listener: Function) {
  if (!browser) return;
  browser.windows.onRemoved.addListener(listener);
}

export function browserTabsOnUpdated(listener: Function) {
  if (!browser) return;
  browser.tabs.onUpdated.addListener(listener);
}

export function browserTabsOnRemoved(listener: Function) {
  if (!browser) return;
  browser.tabs.onRemoved.addListener(listener);
}

export function browserRuntimeOnConnect(listener: Function) {
  if (!browser) return;
  browser.runtime.onConnect.addListener(listener);
}

export function browserRuntimeOnInstalled(listener: Function) {
  if (!browser) return;
  browser.runtime.onInstalled.addListener(listener);
}

export function browserRuntimeConnect(extensionId?: string, connectInfo?: any) {
  if (!browser) return;
  return browser.runtime.connect(extensionId, connectInfo);
}

export default browser;
