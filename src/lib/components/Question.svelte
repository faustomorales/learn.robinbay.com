<script lang="ts">
  import type { Snippet } from "svelte";
  import BaseQuestion from "./BaseQuestion.svelte";
  import { setKeyValue, getKeyValue } from "$lib/common";

  import { fail } from "$lib/common";
  let {
    children,
    options,
    class: className = "",
    stateId,
    selected = $bindable(JSON.parse(getKeyValue(stateId, JSON.stringify([])))),
    multiple = options.reduce(
      (previous, option) => (option.correct ? previous + 1 : previous),
      0,
    ) > 1,
    width = "w-48",
  }: {
    children: Snippet;
    selected?: string[];
    class?: string;
    stateId: string;
    width?: string;
    showButton?: boolean;
    multiple?: boolean;
    options: { id?: string; text: string; hint: string; correct: boolean }[];
  } = $props();

  $effect(() => setKeyValue(stateId, JSON.stringify(selected)));
  let hint = $state("");
  let passed = $state(undefined as boolean | undefined);
  const toggle = (id: string) => {
    const index = selected.indexOf(id);
    if (index > -1) {
      selected = selected.splice(index, 1);
    } else if (multiple) {
      selected.push(id);
    } else {
      selected = [id];
    }
  };
  export const verify = (initial: boolean = false) => {
    let snapshot = $state.snapshot(selected);
    let incorrect = options.filter(
      (o) => snapshot.includes(o.id || o.text) != o.correct,
    );
    if (incorrect.length) {
      if (!initial) {
        fail(incorrect.map((option) => option.hint).join(" "));
      }
    }
  };
</script>

<BaseQuestion class={className} {passed} {hint} validate={() => verify(false)}>
  {@render children()}

  <ul
    class={`mt-2 mb-3 ${width} bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600`}
  >
    {#each options as option, i}
      <li>
        <label class="p-3 flex items-center"
          ><input
            type={multiple ? "checkbox" : "radio"}
            class="me-2"
            checked={selected.includes(option.id || option.text)}
            onchange={() => toggle(option.id || option.text)}
          />{option.text}</label
        >
      </li>
    {/each}
  </ul></BaseQuestion
>
