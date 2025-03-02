import type { Component } from "svelte"
import type { Drivable } from "$lib/sphero/packets"
import SpheroMiniSimulator from "$lib/sphero/simulator"
import Sphero from "./sphero"
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

export const createSpheroDriver = () => {
    let sphero: Sphero = $state(new Sphero());
    let disableCodeEditing = $state(false)
    const drive = async (simulate: boolean, simulatorContainer: HTMLDivElement, iframe: HTMLIFrameElement) => {
        disableCodeEditing = true;

        try {
            if (!iframe) {
                throw new Error("No iframe found");
            }
            let window: {
                drive: (ball: Drivable) => Promise<any>;
                walls?: { x1: number; y1: number; x2: number; y2: number }[];
            } = iframe.contentWindow! as any;
            if (typeof window.drive !== "function") {
                throw new Error("No drive function found");
            }
            let walls =
                window.walls && typeof window.walls === "object" && window.walls.length
                    ? window.walls
                    : [];
            let ball = simulate
                ? new SpheroMiniSimulator(simulatorContainer!, walls)
                : sphero;
            await ball.connect(navigator.bluetooth);
            console.log(
                `Connected to Sphero. Battery Level: ${await ball.getBatteryLevel()}`,
            );
            try {
                await window.drive(ball);
            } catch (e) {
                console.error(`Driving Error Occurred: ${e}`);
            }
            await ball.sleep();
            await ball.disconnect();
        } catch (e) {
            console.error(`Application Error Occurred: ${e}`);
        }

        disableCodeEditing = false;
    };
    return { simulate: drive.bind(null, true), drive: drive.bind(null, false), disableCodeEditing };
}

export type Verifier = (iframe: HTMLIFrameElement, initial: boolean) => void
export type StepConfiguration = {
    title: string;
    verifier: Verifier,
    verify: Verifier
}