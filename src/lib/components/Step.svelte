<script lang="ts">
    import { getContext } from "svelte";
    import { Indicator } from "flowbite-svelte";
    import BasicAccordion from "./BasicAccordion.svelte";
    import type { Verifier } from "$lib/verifications";
    import type { ExerciseContext } from "$lib/common";
    let {
        verifier,
        title = "",
        children,
    }: {
        verifier: Verifier;
        title?: string;
        children: () => any;
    } = $props();
    let isOpen = $state(false);
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
        <span>
            {#if verified.passed}
                <Indicator size="sm" color="green" class="me-1.5" />
            {:else}
                <Indicator size="sm" color="red" class="me-1.5" />
            {/if}
        </span>
        <span class="p-1">{title}</span>
    </div>
    {@render children()}
    <div class="text-red-500 p-2 font-bold">{@html verified.comment}</div>
    <button
        onclick={exerciseContext.update}
        class={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${verified.passed ? 'bg-green-500 hover:bg-green-700' : ''}`}
    >
        Check my work!
    </button>
</BasicAccordion>
