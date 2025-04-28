<script lang="ts">
    import Editor from "./Editor.svelte";
    import type { Tooltip, CodeInput } from "$lib/codemirror.svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        language,
        code,
        tooltips,
        ...props
    }: {
        language: "html" | "css" | "js";
        code: string;
        class?: ClassValue;
        tooltips?: Tooltip[];
    } = $props();

    let base = {
        html: language === "html" ? code : "",
        css: language === "css" ? code : "",
        js: language === "js" ? code : "",
    };
    let tabs = [language];
</script>

<Editor
    {base}
    {tabs}
    class={props.class}
    {tooltips}
    iframeVisibility="disabled"
    readonly
/>
