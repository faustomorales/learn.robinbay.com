<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        header,
        open = $bindable(false),
    }: { open: boolean; children: Snippet; header: Snippet } = $props();
    let defaultClass =
        "flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700";
    let paddingHeading = "pl-3 pr-3 pt-1 pb-1";
    let paddingContent = "p-3";
    let borderClass = "border-s border-e group-first:border-t";
    let borderBottomClass = "border-b";
    let borderSharedClass = "border-gray-200 dark:border-gray-700";
</script>

<h2 class="group">
    <button
        onclick={() => (open = !open)}
        type="button"
        class={`${defaultClass} ${borderClass} ${borderBottomClass} ${borderSharedClass} ${paddingHeading} text-gray-900 dark:text-white dark:bg-gray-800 ${
            open ? "bg-gray-100" : "hover:bg-gray-100 hover:dark:bg-gray-700"
        }`}
        aria-expanded={open}
    >
        {@render header()}
        {#if open}
            <svg
                class="w-3 h-3 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                />
            </svg>
        {:else}
            <svg
                class="w-3 h-3 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                />
            </svg>
        {/if}
    </button>
</h2>
<div
    class={`${paddingContent} ${borderBottomClass} ${borderSharedClass} accordion-item border-s border-e ${open ? "visible" : "hidden"}`}
>
    {@render children()}
</div>

<style>
    .accordion-item {
        transition:
            visibility 0s linear 0.7s,
            opacity 0.7s ease-in-out;
    }

    .accordion-item.visible {
        transition-delay: 0s;
        visibility: visible;
        opacity: 1;
    }
    .accordion-item.hidden {
        opacity: 0;
        visibility: hidden;
    }
</style>
