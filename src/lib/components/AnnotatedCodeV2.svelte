<script lang="ts">
  import { parseInteractiveSnippets } from "$lib/codemirror.svelte";
  import Editor from "./Editor.svelte";
  import type { ClassValue } from "svelte/elements";

  let {
    language,
    code,
    ...props
  }: {
    language: "html" | "css" | "js";
    code: string;
    class?: ClassValue;
  } = $props();

  let template = parseInteractiveSnippets({
    html: language === "html" ? code : "",
    css: language === "css" ? code : "",
    js: language === "js" ? code : "",
  });
  template.parsed[language] = template.parsed[language].trim();
  let tabs = [language];
  let lines = template.parsed[language].split("\n").length;
</script>

<div style="--editor-height: {lines * 1.5}rem">
  <Editor
    inputs={template.inputs}
    base={template.parsed}
    {tabs}
    class={props.class}
    iframeVisibility="disabled"
    readonly
  />
</div>
