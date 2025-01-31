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
    let editor: Editor;
    let states: {
        component: any;
        step?: Step;
    }[] = $state(steps.map((component) => ({ component })));
    let check = (iframe: HTMLIFrameElement, initial = false) => {
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
        states.forEach((state, index) => state.step?.setOpen(index === open));
    };
    setContext<ExerciseContext>("exercise", { update: () => editor.update() });
    onMount(() => {
        setTimeout(editor.update, 100);
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="p-4">
    <div class="flex gap-2">
        <div class="w-1/2">
            {#each states as state}
                <state.component bind:step={state.step}></state.component>
            {/each}
        </div>
        <div class="w-1/2">
            <Editor {check} {stateId} {prepend} {initial} bind:this={editor} />
        </div>
    </div>
</div>
