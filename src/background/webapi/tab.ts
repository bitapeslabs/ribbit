import { EventEmitter } from "events";
import {
  browserTabsCreate,
  browserTabsOnRemoved,
  browserTabsOnUpdated,
} from "./browser";

type TabUpdateInfo = {
  url?: string;
};

type TabInfo = {
  id?: number;
  title?: string;
  origin?: string | null;
  protocol?: string | null;
  url?: string;
};

const tabEvent = new EventEmitter();

browserTabsOnUpdated((tabId: number, changeInfo: TabUpdateInfo) => {
  if (changeInfo.url) {
    tabEvent.emit("tabUrlChanged", tabId, changeInfo.url);
  }
});

// window close will trigger this event also
browserTabsOnRemoved((tabId: number) => {
  tabEvent.emit("tabRemove", tabId);
});

const createTab = async (url: string): Promise<number | undefined> => {
  const tab = await browserTabsCreate({
    active: true,
    url,
  });

  return tab?.id;
};

const openIndexPage = (route: string = ""): Promise<number | undefined> => {
  const url = `index.html${route && `#${route}`}`;

  return createTab(url);
};

const queryCurrentActiveTab = async (): Promise<TabInfo> => {
  return new Promise((resolve) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return resolve({});
        const [activeTab] = tabs;
        const { id, title, url } = activeTab;
        const { origin, protocol } = url
          ? new URL(url)
          : { origin: null, protocol: null };

        if (!origin || origin === "null") {
          resolve({});
          return;
        }

        resolve({ id, title, origin, protocol, url });
      });
    } else {
      resolve({});
    }
  });
};

export default tabEvent;

export { createTab, openIndexPage, queryCurrentActiveTab };
