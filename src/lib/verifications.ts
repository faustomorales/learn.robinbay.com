export let ensureFunctionExists = (iframe: HTMLIFrameElement, name: string): Function => {
    let target = (iframe.contentWindow as any)[name]
    if (!target) {
        throw `The ${name} function is missing.`
    }
    if (typeof target !== "function") {
        throw `${name} is not a function.`
    }
    return target
}

export type Verifier = (iframe: HTMLIFrameElement) => void
export type StepConfiguration = {
    title: string;
    verifier: Verifier,
    verify: Verifier
}