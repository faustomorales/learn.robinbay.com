<script lang="ts">
    import Editor from "./Editor.svelte";
    import type { Tooltip, CodeInput } from "$lib/codemirror.svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        language,
        code,
        tooltips,
        inputs = $bindable([]),
        ...props
    }: {
        language: "html" | "css" | "js";
        code: string;
        class?: ClassValue;
        tooltips?: Tooltip[];
        inputs?: CodeInput[];
    } = $props();

    let initial = {
        html: language === "html" ? code : "",
        css: language === "css" ? code : "",
        js: language === "js" ? code : "",
    };
    let tabs = [language];
</script>

<Editor
    {initial}
    {tabs}
    class={props.class}
    {tooltips}
    bind:inputs
    iframeVisibility="disabled"
    readonly
/>
