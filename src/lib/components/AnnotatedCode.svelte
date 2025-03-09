<script lang="ts">
    import Editor from "./Editor.svelte";
    import type { Tooltip } from "$lib/common";
    import type { ClassValue } from "svelte/elements";

    let {
        language,
        code,

        ...props
    }: {
        language: "html" | "css" | "javascript";
        code: string;
        class?: ClassValue;
        tooltips?: Tooltip[];
    } = $props();

    let initial = {
        html: language === "html" ? code : "",
        css: language === "css" ? code : "",
        js: language === "javascript" ? code : "",
    };
    let tabs = {
        html: language === "html",
        css: language === "css",
        js: language === "javascript",
    };
    let tooltips = {
        html: language === "html" ? props.tooltips : [],
        css: language === "css" ? props.tooltips : [],
        js: language === "javascript" ? props.tooltips : [],
    };
</script>

<Editor
    {initial}
    {tabs}
    class={props.class}
    {tooltips}
    hideIframe
    readonly
    hideTabs
/>
