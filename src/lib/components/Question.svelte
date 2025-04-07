<script lang="ts">
  import type { Snippet } from "svelte";
  import PassFailIndicator from "./PassFailIndicator.svelte";
  import Hint from "./Hint.svelte";
  import { setKeyValue, getKeyValue } from "$lib/common";

  import { fail } from "$lib/common";
  let {
    children,
    options,
    class: className = "",
    stateId,
    multiple = options.reduce(
      (previous, option) => (option.correct ? previous + 1 : previous),
      0,
    ) > 1,
    width = "w-48",
  }: {
    children: Snippet;
    class?: string;
    stateId: string;
    width?: string;
    multiple?: boolean;
    options: { text: string; hint: string; correct: boolean }[];
  } = $props();

  let selected: boolean[] = $state(
    JSON.parse(getKeyValue(stateId, JSON.stringify(options.map(() => false)))),
  );
  $effect(() => setKeyValue(stateId, JSON.stringify(selected)));
  let hint = $state("");
  let passed = $state(false);
  const toggle = (i: number) =>
    (selected = selected.map((value, j) =>
      j === i ? !value : multiple ? value : false,
    ));
  export const verify = (initial: boolean = false) => {
    let snapshot = $state.snapshot(selected);
    let incorrect = options.filter(
      (option, i) => snapshot[i] !== option.correct,
    );
    if (incorrect.length) {
      if (!initial) {
        hint = incorrect.map((option) => option.hint).join(" ");
      }
      passed = false;
      fail("");
    } else {
      hint = "";
      passed = true;
    }
  };
</script>

<div class={className}>
  {@render children()}

  <ul
    class={`mt-2 ${width} bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600`}
  >
    {#each options as option, i}
      <li>
        <label class="p-3 flex items-center"
          ><input
            type={multiple ? "checkbox" : "radio"}
            class="me-2"
            checked={selected[i]}
            onchange={() => toggle(i)}
          />{option.text}</label
        >
      </li>
    {/each}
  </ul>
  <Hint {hint} />
  {#if passed}
    <PassFailIndicator status={"pass"} />
  {/if}
</div>

<style>
  .passed-icon {
    color: green;
    width: 30px;
    height: 30px;
  }
</style>
