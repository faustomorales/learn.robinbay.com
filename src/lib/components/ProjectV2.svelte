<script lang="ts">
  import Question from "./Question.svelte";
  import BaseQuestion from "./BaseQuestion.svelte";
  import {
    parseInteractiveSnippets,
    type Problem,
  } from "$lib/codemirror.svelte";
  import { type PrependedCode, defaultPrependedCode } from "$lib/common";
  import type { Snippet } from "svelte";
  import Editor from "./Editor.svelte";
  let {
    stateId,
    title,
    questions,
    base = defaultPrependedCode,
    prepend = defaultPrependedCode,
    iframeVisibility = "visible",
    layout = "horizontal",
    showConsole = false,
    introduction,
    secondary,
    onIframeLoad = () => {},
  }: {
    stateId: string;
    title: string;
    questions: Problem[];
    layout?: "horizontal" | "vertical";
    iframeVisibility?: "visible" | "hidden" | "disabled";
    showConsole?: boolean;
    base?: PrependedCode;
    prepend?: PrependedCode;
    onIframeLoad?: (iframe: HTMLIFrameElement) => void;
    introduction?: Snippet;
    secondary?: Snippet;
  } = $props();
  let iframe: HTMLIFrameElement | undefined = $state(undefined);
  let template = $state(parseInteractiveSnippets(base));
</script>

<div class="p-4">
  <div
    class={[
      "flex",
      "gap-3",
      layout === "vertical" ? "flex-col-reverse" : "flex-row",
    ]}
  >
    <div class="w-1/3 max-h-screen overflow-y-auto pb-6">
      <h2 class="text-xl font-bold mb-2 mt-3">{title}</h2>
      {#if introduction}
        {@render introduction()}
      {/if}
      <hr class="mb-4 border-gray-200" />
      {#each questions as question}
        {#if question.type === "mc"}
          <Question
            stateId={question.stateId}
            width="w-full"
            class="mt-4 mb-4"
            options={question.options}><p>{@html question.text}</p></Question
          >
        {:else}
          <BaseQuestion
            solution={question.solution}
            class="mt-4 mb-4"
            validate={() => question.validate(template.inputs, iframe!)}
            ><p>{@html question.text}</p></BaseQuestion
          >
        {/if}
      {/each}
    </div>
    <div class="w-2/3 max-h-screen editor">
      {#if secondary}
        {@render secondary()}
      {/if}
      <Editor
        class="pb-4"
        {showConsole}
        {iframeVisibility}
        base={template.parsed}
        tooltips={template.tooltips}
        tabs={Object.keys(base) as any}
        {stateId}
        {prepend}
        bind:inputs={template.inputs}
        {onIframeLoad}
        bind:iframe
      />
    </div>
  </div>
</div>
