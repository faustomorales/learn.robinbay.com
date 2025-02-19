<script lang="ts">
    import type { ExerciseContext } from "$lib/common";

    import Step from "./Step.svelte";
    import Editor from "./Editor.svelte";
    import { onMount, setContext } from "svelte";
    import { defaultPrependedCode, type PrependedCode } from "$lib/common";
    let {
        steps,
        stateId,
        title,
        initial = defaultPrependedCode,
        prepend = defaultPrependedCode,
    }: {
        steps: any[]; // TODO: Make this work with Component<{step: Step}> (also see above)
        stateId: string;
        title: string;
        initial?: PrependedCode;
        prepend?: PrependedCode;
    } = $props();
    let iframe: HTMLIFrameElement | undefined = $state();
    let editor: Editor;
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
    setContext<ExerciseContext>("exercise", {
        check: () => check(iframe, false),
    });
    onMount(() => setTimeout(() => check(iframe, true), 100));
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="p-4 h-screen">
    <div class="flex gap-2">
        <div class="w-1/2 max-h-screen overflow-y-auto pb-6">
            {#each states as state}
                <state.component bind:step={state.step}></state.component>
            {/each}
        </div>
        <div class="w-1/2 h-full max-h-screen">
            <Editor
                {check}
                {stateId}
                {prepend}
                {initial}
                bind:this={editor}
                bind:iframe
            />
        </div>
    </div>
</div>
