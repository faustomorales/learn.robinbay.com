<script lang="ts">
  let {
    hint,
    className = "p-2",
    prefix = "Hint:",
  }: { hint?: string; className?: string; prefix?: string } = $props();
</script>

{#if hint}
  <div class={className}>{prefix} {@html hint || ""}</div>
{/if}
