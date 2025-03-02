<script lang="ts">
    let { hint, className="text-red-500 font-bold p-2" }: { hint: string, className: string } = $props();
</script>

<div class={className}>{@html hint}</div>
