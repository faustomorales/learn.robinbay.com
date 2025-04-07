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
  }: {
    children: Snippet;
    validate?: () => void;
    hint?: string;
    passed?: boolean;
    class?: string;
  } = $props();
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
      <Hint {hint} className={"p-2 bg-gray-100"} />
      {#if validate}
        <div class="mt-2">
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
