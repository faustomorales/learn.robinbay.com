<script lang="ts">
    import { page } from "$app/state";
    import { type Snippet } from "svelte";
    import Sphero from "./Sphero.svelte";
    import Table from "./Table.svelte";
    import type { PrependedCode } from "$lib/common";

    let {
        subtitle,
        title,
        explanation,
        example,
        task,
        hints,
        precheck,
        prepend,
        stateId,
    }: {
        subtitle: string;
        stateId: string;
        title: string;
        prepend: PrependedCode;
        explanation: Snippet;
        example: Snippet;
        task: Snippet;
        precheck: (iframe: HTMLIFrameElement) => void;
        hints: { mistake: string; hint: string }[];
    } = $props();
</script>

<svelte:head>
    <title>{subtitle}</title>
</svelte:head>

<div class="max-w-2xl mx-auto p-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <header class="mb-2">
            <h1 class="text-2xl font-bold">
                {title}
            </h1>
            <p class="text-sm text-gray-500">{subtitle}</p>
        </header>
        {@render explanation()}
        <h2 class="text-xl font-bold mb-2 mt-3">Example</h2>
        {@render example()}
        <h2 class="text-xl font-bold mb-2 mt-3">Your Task</h2>
        {@render task()}
        <Sphero {stateId} {precheck} {prepend} />
        <details>
            <summary
                class="text-md font-bold text-gray-800 dark:text-gray-300 mb-2 mt-2 cursor-pointer"
            >
                Hints
            </summary>
            <p>
                If you're having trouble with this exercise, here are some
                common mistakes and hints to help you out:
            </p>
            <Table
                meta={[
                    { key: "mistake", heading: "Mistake" },
                    { key: "hint", heading: "Hint" },
                ]}
                data={hints}
            />
        </details>
    </div>
    <div class="pt-2 text-right text-xs">
        <a
            href={`https://github.com/faustomorales/learn.robinbay.com/blob/main/src/routes${page.route.id}/%2Bpage.svelte`}
            class="text-gray-500 hover:underline"
            target="_blank">View Source Code</a
        >
    </div>
</div>

<style>
</style>
