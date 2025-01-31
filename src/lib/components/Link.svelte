<script lang="ts">
    import type { HTMLAnchorAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";
    type Props = {
        children: Snippet;
    } & HTMLAnchorAttributes;
    let { children, ...rest }: Props = $props();
</script>

<a
    {...rest}
    class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
    target="_blank"
    >{@render children()}
</a>
