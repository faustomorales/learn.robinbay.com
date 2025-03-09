import type { Component } from "svelte"
import type Step from "$lib/components/Step.svelte"

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

export const createStepChecker = (steps: Component<{ step: Step }>[]) => {
    let states: {
        component: any;
        step?: Step;
    }[] = $state(steps.map((component) => ({ component })));
    let check = (iframe: HTMLIFrameElement | undefined, initial = false) => {
        if (!iframe) {
            throw new Error("Inline frame not found, cannot conduct check.");
        }
        let result = states.reduce(
            (previous, step, index) => {
                if (previous.passed && step.step) {
                    let passedCurrent = step.step.verify(iframe, initial);
                    return {
                        passed: passedCurrent,
                        last: passedCurrent ? index : previous.last,
                    };
                } else if (step.step) {
                    step.step.reset();
                }
                return { passed: false, last: previous.last };
            },
            { passed: true, last: -1 },
        );
        let open = Math.min(result.last + 1, states.length - 1);
        if (initial) {
            states.forEach((state, index) =>
                state.step?.setOpen(index === open),
            );
        }
    };
    return { states, check };
}

export type Verifier = (iframe: HTMLIFrameElement, initial: boolean) => void
export type StepConfiguration = {
    title: string;
    verifier: Verifier,
    verify: Verifier
}