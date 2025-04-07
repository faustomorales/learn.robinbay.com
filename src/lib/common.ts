import { browser } from "$app/environment";

export type PrependedCode = {
  html?: string;
  js?: string;
  css?: string;
};

export type ProjectContext = {
  check: () => void;
};

export const defaultPrependedCode = { html: "", js: "", css: "" };

export const fail = (message: string) => {
  throw new Error(message);
};

export const getKeyValue = (key?: string | null, fallback?: string): string => {
  if (browser && key) {
    let value = localStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  }
  return fallback || "";
};

export const setKeyValue = (key: string | null, value: string) => {
  if (key) {
    localStorage.setItem(key, value);
  }
};
