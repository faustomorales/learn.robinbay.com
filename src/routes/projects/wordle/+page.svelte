<script lang="ts">
  import ProjectV2 from "$lib/components/ProjectV2.svelte";
  import javascriptTemplate from "./template.js?raw";
  import htmlTemplate from "./template.html?raw";
  import cssTemplate from "./template.css?raw";
</script>

<svelte:head>
  <title>Wordle</title>
</svelte:head>

<ProjectV2
  stateId="wordle"
  title="Wordle"
  base={{ js: javascriptTemplate, html: htmlTemplate, css: cssTemplate }}
  questions={[]}
/>

<style>
  :global(.editor) {
    --editor-height: 480px;
    --iframe-height: 240px;
  }
</style>
