<script lang="ts">
  import Button from "./Button.svelte";
  import type { Snippet } from "svelte";
  import PassFailIndicator from "./PassFailIndicator.svelte";
  import Hint from "./Hint.svelte";

  let {
    children,
    hint = "",
    class: className = "",
    validate,
    passed,
    solution = "",
  }: {
    children: Snippet;
    validate?: () => void;
    solution?: string;
    hint?: string;
    passed?: boolean;
    class?: string;
  } = $props();
  let showSolution = $state(false);
</script>

<div class={className}>
  <div class="flex">
    <div class="pt-2">
      <span>
        <PassFailIndicator
          status={passed ? "pass" : passed === false ? "fail" : "unknown"}
        />
      </span>
    </div>
    <div class="flex-grow-1">
      {@render children()}
      <Hint
        {hint}
        className={"p-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 mt-2 mb-2"}
      />
      {#if showSolution}
        <Hint
          hint={solution}
          prefix={"Solution:"}
          className={"p-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 mt-2 mb-2"}
        />
      {/if}
      {#if validate || solution}
        <div class="mt-2">
          {#if validate}
            <Button
              text="Check my work"
              onclick={() => {
                try {
                  validate();
                  passed = true;
                  hint = "";
                } catch (e: any) {
                  passed = false;
                  hint = `${e.message}`;
                }
              }}
            />
          {/if}
          {#if solution}
            <Button
              text="Show Solution"
              onclick={() => (showSolution = !showSolution)}
            />
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .passed-icon {
    color: green;
    width: 30px;
    height: 30px;
  }
</style>
