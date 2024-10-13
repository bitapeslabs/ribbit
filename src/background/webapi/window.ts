import { EventEmitter } from "events";

import { IS_WINDOWS } from "@/shared/constants";

import {
  browserWindowsCreate,
  browserWindowsGetCurrent,
  browserWindowsOnFocusChanged,
  browserWindowsOnRemoved,
  browserWindowsRemove,
  browserWindowsUpdate,
} from "./browser";

const event = new EventEmitter();

// Event type for window focus and removal changes
export type WindowFocusChangeCallback = (winId: number) => void;

// Subscribe to focus change event
browserWindowsOnFocusChanged((winId: number) => {
  event.emit("windowFocusChange", winId);
});

// Subscribe to window removed event
browserWindowsOnRemoved((winId: number) => {
  event.emit("windowRemoved", winId);
});

const BROWSER_HEADER = 80;
const WINDOW_SIZE = {
  width: 400 + (IS_WINDOWS ? 14 : 0), // idk why windows cut the width.
  height: 600,
};

// Define the options for creating a window
interface CreateWindowOptions {
  url: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  focused?: boolean;
  state?: "fullscreen" | "maximized" | "minimized" | "normal" | "docked";
  type?: "normal" | "popup" | "panel" | "detached_panel";
}

// Function to create a browser window
const create = async ({
  url,
  ...rest
}: CreateWindowOptions): Promise<number | undefined> => {
  const {
    top: cTop,
    left: cLeft,
    width,
  } = await browserWindowsGetCurrent({
    windowTypes: ["normal"],
  } as any);

  const top = (cTop || 0) + BROWSER_HEADER;
  const left = (cLeft || 0) + (width || 0) - WINDOW_SIZE.width;

  const currentWindow = await browserWindowsGetCurrent();
  let win;
  if (currentWindow.state === "fullscreen") {
    // browser.windows.create does not pass state to chrome
    win = await browserWindowsCreate({
      focused: true,
      url,
      type: "popup",
      ...rest,
      width: undefined,
      height: undefined,
      left: undefined,
      top: undefined,
      state: "fullscreen",
    });
  } else {
    win = await browserWindowsCreate({
      focused: true,
      url,
      type: "popup",
      top,
      left,
      ...WINDOW_SIZE,
      ...rest,
    });
  }

  // Shim for Firefox
  if (win.left !== left) {
    await browserWindowsUpdate(win.id!, { left, top });
  }

  return win.id;
};

// Function to remove a window by its id
const remove = async (winId: number): Promise<void> => {
  return browserWindowsRemove(winId);
};

// Function to open a notification window
interface OpenNotificationOptions extends Partial<CreateWindowOptions> {
  route?: string;
}

const openNotification = ({
  route = "",
  ...rest
}: OpenNotificationOptions = {}): Promise<number | undefined> => {
  const url = `notification.html${route ? `#${route}` : ""}`;

  return create({ url, ...rest });
};

export default {
  openNotification,
  event,
  remove,
};
