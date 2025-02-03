<script lang="ts">
    let { hint }: { hint: string } = $props();
</script>

<div class="text-red-500 font-bold p-2">{@html hint}</div>
