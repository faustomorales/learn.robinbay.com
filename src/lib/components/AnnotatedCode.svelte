<script lang="ts">
    import Editor from "./Editor.svelte";
    import type { Tooltip, CodeInput } from "$lib/codemirror.svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        language,
        code,
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
    let tooltips = {
        html: language === "html" ? props.tooltips : [],
        css: language === "css" ? props.tooltips : [],
        js: language === "js" ? props.tooltips : [],
    };
    let inputs = {
        html: language === "html" ? props.inputs : [],
        css: language === "css" ? props.inputs : [],
        js: language === "js" ? props.inputs : [],
    };
</script>

<Editor
    {initial}
    {tabs}
    class={props.class}
    {tooltips}
    {inputs}
    iframeVisibility="disabled"
    readonly
/>
