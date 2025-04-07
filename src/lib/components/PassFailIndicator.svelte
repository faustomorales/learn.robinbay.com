<script lang="ts">
  import { Indicator } from "flowbite-svelte";
  import confetti from "canvas-confetti";
  let { status }: { status: "pass" | "fail" | "unknown" } = $props();
  let common = { size: "sm" as any, class: "me-1.5" as any };

  let previousStatus = $state(status);
  $effect(() => {
    if (previousStatus !== "pass" && status === "pass") {
      const rect = indicator.getBoundingClientRect();
      confetti({
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    }
  });
  let indicator: HTMLSpanElement;
</script>

<span bind:this={indicator}>
  {#if status == "pass"}
    <Indicator {...common} color="green" />
  {:else if status == "fail"}
    <Indicator {...common} color="red" />
  {:else if status == "unknown"}
    <Indicator {...common} color="gray" />
  {/if}
</span>
