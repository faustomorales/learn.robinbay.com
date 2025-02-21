<script lang="ts">
  /// <reference types="web-bluetooth" />
  import { Modal, Button } from "flowbite-svelte";
  import { Sphero } from "./sphero";

  let modal = $state({ open: false, message: "", title: "" });

  let sphero: Sphero = $state(new Sphero());
  let connected = $state(false);

  const connectToDevice = () =>
    sphero.setup(navigator.bluetooth).then(
      () => {
        console.log("Connected to Sphero");
        connected = true;
      },
      (error) =>
        (modal = {
          open: true,
          title: "Connection Failure",
          message: error.message,
        }),
    );
</script>

<svelte:head>
  <title>Sphero</title>
</svelte:head>

{#if connected}
  <Button
    onclick={() =>
      sphero
        .getBatteryLevel()
        .then((value) => console.log(`Battery Level: ${value}`))}
    >getBatteryLevel</Button
  >
  <Button onclick={() => sphero.setColor({ red: 255, green: 0, blue: 0 })}
    >Red</Button
  >
  <Button onclick={() => sphero.setColor({ red: 0, green: 255, blue: 0 })}
    >Green</Button
  >
  <Button onclick={() => sphero.setColor({ red: 0, green: 0, blue: 255 })}
    >Blue</Button
  >
  <Button onclick={() => sphero.wake().then(() => console.log("Woke up"))}
    >Wake</Button
  >
  <Button onclick={() => sphero.sleep().then(() => console.log("Slept"))}
    >Sleep</Button>
{:else}
  <Button onclick={connectToDevice}>Connect</Button>
{/if}

<Modal title={modal.title} bind:open={modal.open} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {modal.message}
  </p>
  <svelte:fragment slot="footer">
    <Button>Close</Button>
  </svelte:fragment>
</Modal>
