import type { Component } from "svelte"
import type Step from "$lib/components/Step.svelte"

export let ensureVariableType = <VariableType extends "object" | "string" | "number" | "function" | "array<number>" | "array<string>",
    ReturnType extends (
        VariableType extends "object" ? object :
        VariableType extends "string" ? string :
        VariableType extends "number" ? number :
        VariableType extends "function" ? Function :
        VariableType extends "array<number>" ? Array<number> :
        VariableType extends "array<string>" ? Array<string> : never
    )>(name: string, target: any, type: VariableType): ReturnType => {
    if (type.startsWith("array")) {
        if (!Array.isArray(target)) {
            throw `The ${name} variable was found but it is not an array.`
        }
        let arrayType = type.slice(6, -1) as "string" | "number"
        let targetType = [... new Set(target.map((element: any) => typeof element))]
        if (targetType.length !== 1) {
            throw new Error(`The ${name} variable was found but, instead of containing only ${arrayType}, it contains a mix of ${targetType.join(", ")}.`)
        } else if (targetType[0] !== arrayType) {
            throw new Error(`The ${name} variable was found but, instead of containing only ${arrayType}, it contains ${targetType[0]}.`)
        }
        return target as ReturnType
    }
    else {
        let targetType = typeof target;
        if (targetType !== type) {
            throw `The ${name} variable was found but it is a ${targetType} instead of a ${type}.`
        }
    }
    return target
}

export let ensureVariableExists = <
    VariableType extends "object" | "string" | "number" | "function" | "array<number>" | "array<string>",
    ReturnType extends (
        VariableType extends "object" ? object :
        VariableType extends "string" ? string :
        VariableType extends "number" ? number :
        VariableType extends "function" ? Function :
        VariableType extends "array<number>" ? Array<number> :
        VariableType extends "array<string>" ? Array<string> : never
    )>(
        name: string, type: VariableType, iframe?: HTMLIFrameElement): ReturnType => {
    if (!iframe) {
        throw new Error("Inline frame not found, cannot conduct check.")
    }
    let target = (iframe.contentWindow as any)[name]
    if (!target) {
        throw `The ${name} variable is missing.`
    }
    return ensureVariableType(name, target, type)
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