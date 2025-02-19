<script lang="ts">
    import { onMount } from "svelte";
    let { children } = $props();
    import "../app.css";
    import light from "svelte-highlight/styles/github";
    import dark from "svelte-highlight/styles/github-dark";
    let isDarkMode = $state(false);
    onMount(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        isDarkMode = mediaQuery.matches;

        const listener = (event: any) => {
            isDarkMode = event.matches;
        };

        mediaQuery.addEventListener("change", listener);

        return () => {
            mediaQuery.removeEventListener("change", listener);
        };
    });
</script>

<svelte:head>
    {#if isDarkMode}
        {@html dark}
    {:else}
        {@html light}
    {/if}
</svelte:head>

{@render children()}
