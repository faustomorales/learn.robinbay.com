<script lang="ts">
    let {
        tag = "ul",
        children,
    }: {
        tag?: "ul" | "ol";
        children: () => any;
    } = $props();
</script>

<svelte:element
    this={tag}
    class={`${tag === "ul" ? "list-disc" : "list-decimal"} list-outside ml-4`}
    >{@render children()}</svelte:element
>
