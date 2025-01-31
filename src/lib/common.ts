export type PrependedCode = {
    html: string;
    js: string;
    css: string;
}

export type ExerciseContext = {
    update: () => void;
}

export const defaultPrependedCode = { html: "", js: "", css: "" };

export const fail = (message: string) => { throw new Error(message) }