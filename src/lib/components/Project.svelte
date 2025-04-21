<script lang="ts">
    import type { ProjectContext } from "$lib/common";

    import Step from "./Step.svelte";
    import Editor from "./Editor.svelte";
    import { onMount, setContext, type Component } from "svelte";
    import { defaultPrependedCode, type PrependedCode } from "$lib/common";
    import { createStepChecker } from "$lib/verifications.svelte";
    let {
        steps,
        stateId,
        title,
        base = defaultPrependedCode,
        prepend = defaultPrependedCode,
    }: {
        steps: Component<{ step: Step }>[];
        stateId: string;
        title: string;
        base?: PrependedCode;
        prepend?: PrependedCode;
    } = $props();
    let iframe: HTMLIFrameElement | undefined = $state();
    let editor: Editor;
    let { states, check } = createStepChecker(steps);

    setContext<ProjectContext>("project", {
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
        <div class="w-1/2 max-h-screen">
            <Editor
                {stateId}
                {prepend}
                {base}
                bind:this={editor}
                bind:iframe
            />
        </div>
    </div>
</div>
