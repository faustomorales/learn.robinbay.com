export type PrependedCode = {
    html: string;
    js: string;
    css: string;
}

export type ProjectContext = {
    check: () => void;
}

export const defaultPrependedCode = { html: "", js: "", css: "" };

export const fail = (message: string) => { throw new Error(message) }