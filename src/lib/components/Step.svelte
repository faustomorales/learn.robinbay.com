<script lang="ts">
    import { AccordionItem, Indicator } from "flowbite-svelte";
    import type { Verifier } from "$lib/verifications";
    let {
        verifier,
        title = "",
        children,
    }: {
        verifier: Verifier;
        title?: string;
        children: () => any;
    } = $props();
    export const reset = () => {
        verified = { passed: false, comment: "" };
    };
    export const verify = (iframe: HTMLIFrameElement) => {
        try {
            verifier(iframe);
            verified = { passed: true, comment: "" };
            return true;
        } catch (e: any) {
            verified = { passed: false, comment: e.message };
            return false;
        }
    };
    let verified = $state({ passed: false, comment: "" });
</script>

<AccordionItem>
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
    <em class="comment">{@html verified.comment}</em>
</AccordionItem>
