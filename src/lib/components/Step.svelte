<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import PassFailIndicator from "./PassFailIndicator.svelte";
    import BasicAccordionItem from "./BasicAccordionItem.svelte";
    import Hint from "./Hint.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
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
    let open = $state(false);
    let solutionIsOpen = $state(false);
    let showSolution = () => {
        solutionIsOpen = true;
    };
    export const reset = () => {
        verified = { status: "unknown", comment: "" };
    };
    export const setOpen = (targetState: boolean) => {
        open = targetState;
    };
    const exerciseContext = getContext<ExerciseContext>("exercise");
    export const verify = (iframe: HTMLIFrameElement, initial = false) => {
        try {
            verifier(iframe, initial);
            verified = { status: "pass", comment: "" };
            return true;
        } catch (e: any) {
            verified = {
                status: initial ? "unknown" : "fail",
                comment: initial ? "" : e.message,
            };
            return false;
        }
    };
    let verified = $state({
        status: "unknown" as "pass" | "fail" | "unknown",
        comment: "",
    });
</script>

<BasicAccordionItem {open}>
    {#snippet header()}
        <div class="flex items-center">
            <PassFailIndicator status={verified.status} />
            <span class="p-1">{title}</span>
        </div>
    {/snippet}

    {@render children()}
    {#if solutionIsOpen && solution}
        {@render solution()}
    {/if}
    <Hint hint={verified.comment} />
    <div class="flex gap-2">
        <button
            onclick={exerciseContext.check}
            class={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${verified.status === "pass" ? "bg-green-500 hover:bg-green-700" : ""}`}
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
</BasicAccordionItem>
