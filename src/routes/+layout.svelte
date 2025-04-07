<script lang="ts">
  let { children } = $props();
  import "../app.css";
</script>

{@render children()}

<style lang="postcss">
  @reference "tailwindcss";
  :global(a.external) {
    @apply underline text-blue-600 hover:text-blue-800 visited:text-purple-600;
  }
</style>
