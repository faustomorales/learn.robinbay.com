<script lang="ts">
    import { onMount } from "svelte";
    import type { ClassValue } from "svelte/elements";
    import Prism from "prismjs";
    import "prismjs/plugins/keep-markup/prism-keep-markup";

    let props: { language: "markup" | "css" | "javascript"; code: string; class?: ClassValue } =
        $props();
    let sanitized =
        props.language === "markup"
            ? props.code
                  .replaceAll("<mark>", "!!!mark!!!")
                  .replaceAll("</mark>", "???mark???")
                  .replaceAll("<", "&lt;")
                  .replaceAll(">", "&gt;")
                  .replaceAll("!!!mark!!!", "<mark>")
                  .replaceAll("???mark???", "</mark>")
            : props.code;
    let container: HTMLDivElement;
    onMount(() => Prism.highlightAllUnder(container));
</script>

<div class={`bg-gray-800 rounded-lg p-4 ${props.class}`} bind:this={container}>
    <pre class="!bg-transparent"><code class={`language-${props.language}`}
            >{@html sanitized}</code
        ></pre>
</div>

<style>
    :global(mark) {
        cursor: pointer;
        background-color: transparent;
        transition: background-color 0.2s;
        color: unset;
    }

    :global(mark:hover) {
        background-color: rgba(255, 255, 0, 0.2);
    }

    /* Override Prism styles to ensure proper display */
    :global(pre[class*="language-"]) {
        margin: 0;
        padding: 0;
        overflow-x: auto;
    }
</style>
