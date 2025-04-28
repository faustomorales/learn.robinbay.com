<script lang="ts">
  import Wizard from "$lib/components/Wizard.svelte";
  import Introduction from "./Introduction.svelte";
  import { fail } from "$lib/common";
  import { ensureVariableExists } from "$lib/verifications.svelte";
</script>

<Wizard
  title="for loops"
  stages={[
    {
      stateId: "lessons/control-flow/loops",
      title: "Introduction to for loops",
      iframeVisibility: "hidden",
      showConsole: true,
      introductionComponent: Introduction,
      questions: [],
      base: { js: "", html: "", css: "" },
      
    },
  ]}
/>
