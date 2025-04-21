<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  let {
    text,
    color = "blue",
    disabled = false,
    confirm = "",
    onclick,
  }: {
    text: string;
    color?: "blue" | "red";
    disabled?: boolean;
    confirm?: string;
    onclick: (event: MouseEvent) => void;
  } = $props();
  let showConformation = $state(false);
  let lastClickEvent: MouseEvent | undefined = $state(undefined);
</script>

<Modal title="Terms of Service" bind:open={showConformation} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {confirm}
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => onclick(lastClickEvent!)}>Yes</Button>
    <Button color="alternative">No</Button>
  </svelte:fragment>
</Modal>

<button
  class={`disabled:bg-gray-600 disabled:dark:bg-gray-600 bg-${color}-500 hover:bg-${color}-700 text-white rounded py-2 px-4`}
  onclick={(event) => {
    if (confirm) {
      lastClickEvent = event;
      showConformation = true;
    } else {
      onclick(event);
    }
  }}
  {disabled}
>
  {text}
</button>
