<script lang="ts">
    import Step from "./Step.svelte";
    import Editor from "./Editor.svelte";
    import { Accordion } from "flowbite-svelte";
    import { defaultPrependedCode, type PrependedCode } from "$lib/common";
    let {
        steps,
        stateId,
        title,
        children,
        prepend = defaultPrependedCode,
    }: {
        steps: any[]; // TODO: Make this work with Component<{step: Step}> (also see above)
        stateId: string;
        title: string;
        children: () => any;
        prepend?: PrependedCode;
    } = $props();
    let states: {
        component: any;
        step?: Step;
    }[] = $state(steps.map((component) => ({ component })));
    let check = (iframe: HTMLIFrameElement) =>
        states.reduce((previous, step) => {
            if (previous && step.step) {
                return step.step.verify(iframe);
            } else if (step.step) {
                step.step.reset();
            }
            return false;
        }, true);
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="flex p-2">
    <div class="w-1/4">
        <Accordion>
            {#each states as state}
                <state.component bind:step={state.step}></state.component>
            {/each}
        </Accordion>
    </div>
    <div class="w-3/4 p-4">
        <h1 class="text-3xl mb-2">{title}</h1>
        {@render children()}
        <div class="mt-2"><Editor {check} {stateId} {prepend} /></div>
    </div>
</div>
