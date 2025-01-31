<script lang="ts">
    export let open: boolean = false;
    let defaultClass =
        "flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700";
    let paddingHeading = "pl-3 pr-3 pt-1 pb-1";
    let paddingContent = "p-3"
    let borderClass = "border-s border-e group-first:border-t";
    let borderBottomClass = "border-b";
    let borderSharedClass = "border-gray-200 dark:border-gray-700";

    const handleToggle = () => (open = !open);
</script>

<h2 class="group">
    <button
        on:click={handleToggle}
        type="button"
        class={`${defaultClass} ${borderClass} ${borderBottomClass} ${borderSharedClass} ${paddingHeading} ${
            open
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-gray-800"
        }`}
        aria-expanded={open}
    >
        <slot name="header" />
        {#if open}
            <slot name="arrowup">
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
            </slot>
        {:else}
            <slot name="arrowdown">
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
            </slot>
        {/if}
    </button>
</h2>
<div
    class={`${paddingContent} ${borderBottomClass} ${borderSharedClass} border-s border-e ${open ? "" : "hidden"}`}
>
    <slot />
</div>
