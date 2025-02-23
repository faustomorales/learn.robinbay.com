<script lang="ts">
  import { Modal, Button } from "flowbite-svelte";
  import Editor from "$lib/components/Editor.svelte";
  import Sphero from "./sphero";

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
  let buttons: { text: string; action: () => Promise<{ sequence: number }> }[] =
    [
      {
        text: "Red",
        action: () => sphero.setColor({ red: 255, green: 0, blue: 0 }),
      },
      {
        text: "Green",
        action: () => sphero.setColor({ red: 0, green: 255, blue: 0 }),
      },
      {
        text: "Blue",
        action: () => sphero.setColor({ red: 0, green: 0, blue: 255 }),
      },
      { text: "Wake", action: sphero.wake },
      { text: "Sleep", action: sphero.sleep },
      {
        text: "Reset Heading",
        action: sphero.resetHeading,
      },
      { text: "Roll 3s", action: () => sphero.rollTime(200, 0, 3000) },
    ];
</script>

<svelte:head>
  <title>Sphero</title>
</svelte:head>

<Editor stateId={"/sphero"} tabs={{ js: true }} hideIframe />

<Button onclick={connectToDevice}>Connect</Button>

<Modal title={modal.title} bind:open={modal.open} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    {modal.message}
  </p>
  <svelte:fragment slot="footer">
    <Button>Close</Button>
  </svelte:fragment>
</Modal>
