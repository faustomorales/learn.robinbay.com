<script lang="ts">
    import type { Snippet } from "svelte";
    import { browser } from "$app/environment";
    import { fail } from "$lib/common";
    let {
        children,
        options,
        class: className = "",
        stateId,
    }: {
        children: Snippet;
        class?: string;
        stateId: string;
        options: { text: string; hint: string; correct: boolean }[];
    } = $props();
    let getInitialSelections = () => {
        let initial = options.map(() => false);
        if (browser) {
            let stored = JSON.parse(localStorage.getItem(stateId) || "[]");
            if (stored.length === initial.length) {
                initial = stored;
            }
        }
        return initial;
    };
    let selected = $state(
        browser &&
            JSON.parse(
                localStorage.getItem(stateId) ||
                    JSON.stringify(options.map(() => false)),
            ),
    );
    $effect(() => {
        localStorage.setItem(stateId, JSON.stringify(selected));
    });
    export const verify = () => {
        let snapshot = $state.snapshot(selected);
        let incorrect = options.filter(
            (option, i) => snapshot[i] !== option.correct,
        );
        if (incorrect.length) {
            fail(
                "One of the answers is incorrect. " +
                    incorrect.map((option) => option.hint).join(" "),
            );
        }
    };
</script>

<div class={className}>
    {@render children()}

    <ul
        class="mt-2 w-48 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600"
    >
        {#each options as option, i}
            <li>
                <label class="p-3 flex items-center"
                    ><input
                        type="checkbox"
                        class="me-2"
                        bind:checked={selected[i]}
                    />{option.text}</label
                >
            </li>
        {/each}
    </ul>
</div>
