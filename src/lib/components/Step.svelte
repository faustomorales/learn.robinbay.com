<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import PassFailIndicator from "./PassFailIndicator.svelte";
    import BasicAccordion from "./BasicAccordion.svelte";
    import Hint from "./Hint.svelte";
    import type { Verifier } from "$lib/verifications";
    import type { ExerciseContext } from "$lib/common";
    let {
        verifier,
        title = "",
        children,
        solution,
    }: {
        verifier: Verifier;
        solution?: Snippet;
        title?: string;
        children: () => any;
    } = $props();
    let isOpen = $state(false);
    let solutionIsOpen = $state(false);
    let showSolution = () => {
        solutionIsOpen = true;
    };
    export const reset = () => {
        verified = { passed: false, comment: "" };
    };
    export const setOpen = (targetState: boolean) => {
        isOpen = targetState;
    };
    const exerciseContext = getContext<ExerciseContext>("exercise");
    export const verify = (iframe: HTMLIFrameElement, initial = false) => {
        try {
            verifier(iframe);
            verified = { passed: true, comment: "" };
            return true;
        } catch (e: any) {
            verified = { passed: false, comment: initial ? "" : e.message };
            return false;
        }
    };
    let verified = $state({ passed: false, comment: "" });
</script>

<BasicAccordion bind:open={isOpen}>
    <div slot="header" class="flex items-center">
        <PassFailIndicator passed={verified.passed} />
        <span class="p-1">{title}</span>
    </div>
    {@render children()}
    {#if solutionIsOpen && solution}
        {@render solution()}
    {/if}
    <Hint hint={verified.comment} />
    <div class="flex gap-2">
        <button
            onclick={exerciseContext.update}
            class={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${verified.passed ? "bg-green-500 hover:bg-green-700" : ""}`}
        >
            Check my work!
        </button>
        {#if solution}
            <button
                onclick={showSolution}
                class={`bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded`}
            >
                Show Solution
            </button>
        {/if}
    </div>
</BasicAccordion>
