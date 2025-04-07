<script lang="ts">
  let {
    hint,
    className = "p-2",
  }: { hint: string; className?: string } = $props();
</script>

{#if hint}
  <div class={className}>Hint: {@html hint}</div>
{/if}
