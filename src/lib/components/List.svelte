<script lang="ts">
    let {
        children,
    }: {
        children: () => any;
    } = $props();
</script>

<ul class="list-disc list-outside ml-4">{@render children()}</ul>
