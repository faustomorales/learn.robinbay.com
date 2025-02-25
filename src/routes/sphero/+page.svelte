<script lang="ts">
  import Highlight from "svelte-highlight";
  import javascript from "svelte-highlight/languages/javascript";
  import documentation from "./documentation";
  import Editor from "$lib/components/Editor.svelte";
  import Sphero from "$lib/sphero/";

  let iframe: HTMLIFrameElement | undefined = $state(undefined);

  let sphero: Sphero = $state(new Sphero());

  const drive = async () => {
    try {
      await sphero.connect(navigator.bluetooth);
      console.log(
        `Connected to Sphero. Battery Level: ${await sphero.getBatteryLevel()}`,
      );
      try {
        if (!iframe) {
          throw new Error("No iframe found");
        }
        let window = iframe.contentWindow! as any;
        if (typeof window.drive !== "function") {
          throw new Error("No drive function found");
        }
        await window.drive(sphero);
      } catch (e) {
        console.error(`Driving Error Occurred: ${e}`);
      }
      await sphero.sleep();
      await sphero.disconnect();
    } catch (e) {
      console.error(`Application Error Occurred: ${e}`);
    }
  };

  let sampleCode = `
var drive = async (sphero) => {
    await sphero.wake();
    await sphero.wait(500);
    await sphero.setColor(255, 0, 0)
    await sphero.rollTime(200, 0, 500);
    await sphero.wait(500);
}
  `;
</script>

<svelte:head>
  <title>Sphero</title>
</svelte:head>

<div class="p-8 h-screen">
  <div class="flex gap-8">
    <div class="w-1/2 max-h-screen overflow-y-auto mb-6">
      <h2 class="text-4xl font-bold">Sphero Playground</h2>
      <p class="mt-2">
        This application allows you to control a Sphero Mini using JavaScript.
        You can do this by providing a JavaScript code snippet that includes an
        async function called <span class="font-mono font-bold">drive</span> which
        will be called with a single argument that represents the Sphero ball.
      </p>
      <Highlight class="mt-2" language={javascript} code={sampleCode.trim()} />

      {#each documentation as { title, description, code }}
        <h3 class="text-2xl font-bold mt-6 font-mono">{title}</h3>
        <p class="mt-2">{description}</p>
        <Highlight class="mt-2" language={javascript} code={code.trim()} />
      {/each}
    </div>

    <div class="w-1/2 h-full max-h-screen">
      <Editor bind:iframe stateId={"/sphero"} tabs={{ js: true }} hideIframe />
      <button
        onclick={drive}
        class={`mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded`}
      >
        Run on Sphero
      </button>
    </div>
  </div>
</div>
