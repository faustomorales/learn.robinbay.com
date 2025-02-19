<script lang="ts">
    import { Indicator } from "flowbite-svelte";
    let { status }: { status: "pass" | "fail" | "unknown" } = $props();
    let common = { size: "sm" as any, class: "me-1.5" as any };
</script>

<span>
    {#if status == "pass"}
        <Indicator {...common} color="green" />
    {:else if status == "fail"}
        <Indicator {...common} color="red" />
    {:else if status == "unknown"}
        <Indicator {...common} color="gray" />
    {/if}
</span>
