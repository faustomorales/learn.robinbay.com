<script lang="ts">
  import Editor from "$lib/components/Editor.svelte";
  import Hint from "$lib/components/Hint.svelte";
  import { createSpheroState } from "$lib/sphero/utilities.svelte";
  import { onMount } from "svelte";
  let {
    stateId,
    prepend = { html: "", css: "", js: "" },
    precheck = (iframe) => null,
  }: {
    stateId: string;
    precheck?: (iframe: HTMLIFrameElement) => void;
    prepend?: { html?: string; css?: string; js?: string };
  } = $props();
  let sphero: ReturnType<typeof createSpheroState> | undefined =
    $state(undefined);
  let iframe: HTMLIFrameElement | undefined = $state(undefined);
  let simulatorContainer: HTMLDivElement | undefined = $state(undefined);
  onMount(() => {
    sphero = createSpheroState(precheck, simulatorContainer, iframe);
  });
</script>

<Editor
  bind:iframe
  {stateId}
  tabs={["js"]}
  iframeVisibility="hidden"
  {prepend}
  readonly={sphero?.status.driving}
/>
<Hint
  hint={sphero?.status.error}
  className="text-red-500 p-2 font-mono text-xs"
/>

{#if sphero?.status.driving}
  <button
    onclick={() => sphero!.stop(iframe)}
    class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded`}
    >Stop Program</button
  >
{:else}
  <button
    onclick={() => sphero!.drive(true)}
    class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded`}
  >
    Run on Simulator
  </button>
  <button
    onclick={() => sphero!.drive(false)}
    class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-blue-500 hover:bg-blue-700 text-white ml-3 py-2 px-4 rounded`}
  >
    Run on Sphero
  </button>
{/if}

<div bind:this={simulatorContainer} class="simulator mt-4"></div>
