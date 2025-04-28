<script lang="ts">
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { type Problem } from "$lib/codemirror.svelte";
  import type { PrependedCode } from "$lib/common";
  import ProjectV2 from "./ProjectV2.svelte";
  import type { Component, Snippet } from "svelte";

  let {
    stages,
    title,
  }: {
    title: string;
    stages: {
      stateId: string;
      title: string;
      iframeVisibility?: "visible" | "hidden" | "disabled";
      showConsole?: boolean;
      questions: Problem[];
      base: PrependedCode;
      introductionComponent?: Component;
      introduction?: Snippet;
    }[];
  } = $props();
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
  {/if}
</svelte:head>

<Splide aria-label={title} options={{ drag: false }}>
  {#each stages as stage}
    <SplideSlide>
      <div class="max-w-6xl mx-auto p-2">
        <ProjectV2 layout="horizontal" {...stage} />
      </div>
    </SplideSlide>
  {/each}
</Splide>
