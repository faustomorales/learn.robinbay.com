<script lang="ts">
    import type { ExerciseContext } from "$lib/common";

    import Step from "./Step.svelte";
    import Editor from "./Editor.svelte";
    import { onMount, setContext, type Component } from "svelte";
    import { defaultPrependedCode, type PrependedCode } from "$lib/common";
    import { createStepChecker } from "$lib/verifications.svelte";
    let {
        steps,
        stateId,
        title,
        initial = defaultPrependedCode,
        prepend = defaultPrependedCode,
    }: {
        steps: Component<{ step: Step }>[]; // TODO: Make this work with Component<{step: Step}> (also see above)
        stateId: string;
        title: string;
        initial?: PrependedCode;
        prepend?: PrependedCode;
    } = $props();
    let iframe: HTMLIFrameElement | undefined = $state();
    let editor: Editor;
    let { states, check } = createStepChecker(steps);

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
                {stateId}
                {prepend}
                {initial}
                bind:this={editor}
                bind:iframe
            />
        </div>
    </div>
</div>
