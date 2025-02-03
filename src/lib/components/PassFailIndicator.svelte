<script lang="ts">
    import { Indicator } from "flowbite-svelte";
    let { passed }: { passed: boolean } = $props();
</script>

<span>
    {#if passed}
        <Indicator size="sm" color="green" class="me-1.5" />
    {:else}
        <Indicator size="sm" color="red" class="me-1.5" />
    {/if}
</span>
