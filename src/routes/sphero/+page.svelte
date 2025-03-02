<script lang="ts">
  import Highlight from "svelte-highlight";
  import javascript from "svelte-highlight/languages/javascript";
  import documentation from "./documentation";
  import Editor from "$lib/components/Editor.svelte";
  import Sphero from "$lib/sphero/";
  import SpheroMiniSimulator from "$lib/sphero/simulator";
  import type { Drivable } from "$lib/sphero/packets";

  let iframe: HTMLIFrameElement | undefined = $state(undefined);
  let simulatorContainer: HTMLDivElement | undefined = $state(undefined);
  let sphero: Sphero = $state(new Sphero());
  let disableCodeEditing = $state(false);

  const drive = async (simulate: boolean) => {
    disableCodeEditing = true;
    let ball = simulate
      ? new SpheroMiniSimulator(simulatorContainer!, [
          { x1: 0, y1: -3, x2: 7, y2: -3 },
        ])
      : sphero;
    try {
      await ball.connect(navigator.bluetooth);
      console.log(
        `Connected to Sphero. Battery Level: ${await ball.getBatteryLevel()}`,
      );
      try {
        if (!iframe) {
          throw new Error("No iframe found");
        }
        let window: { drive: (ball: Drivable) => Promise<any> } =
          iframe.contentWindow! as any;
        if (typeof window.drive !== "function") {
          throw new Error("No drive function found");
        }
        await window.drive(ball);
      } catch (e) {
        console.error(`Driving Error Occurred: ${e}`);
      }
      await ball.sleep();
      await ball.disconnect();
    } catch (e) {
      console.error(`Application Error Occurred: ${e}`);
    }
    disableCodeEditing = false;
  };

  let sampleCode = `
var drive = async (sphero) => {
    await sphero.wake();
    await sphero.delay(500);
    await sphero.setColor(255, 0, 0)
    await sphero.rollTime(200, 0, 500);
    await sphero.delay(500);
}
  `;
</script>

<svelte:head>
  <title>Sphero</title>
</svelte:head>

<div class="p-4 h-screen print:h-full">
  <div class="flex gap-8">
    <div class="w-1/2 max-h-screen overflow-y-auto mb-6 print:w-full print:max-h-full">
      <h2 class="text-4xl font-bold">Sphero Playground</h2>
      <p class="mt-2">
        This application allows you to control a Sphero Mini using JavaScript.
        You can do this by providing a JavaScript code snippet that includes an
        async function called <span class="font-mono font-bold">drive</span> which
        will be called with a single argument that represents the Sphero ball.
      </p>
      <Highlight class="mt-2" language={javascript} code={sampleCode.trim()} />
      <p class="mt-2">
        When connecting to the Sphero, you will be prompted to select a
        Bluetooth device. For this to work, you must make sure that you are
        using a browser that supports the Web Bluetooth API (e.g., Google Chrome
        on a laptop/desktop or the Bluefy app for iOS). You may have to modify
        your system settings to allow the browser to communicate with Bluetooth
        devices.
      </p>
      <p class="mt-2">
        The <span class="font-mono font-bold">sphero</span> object has the following
        methods.
      </p>

      {#each documentation as { title, description, code }}
        <h3 class="text-2xl font-bold mt-6 font-mono">{title}</h3>
        <p class="mt-2">{description}</p>
        <Highlight class="mt-2" language={javascript} code={code.trim()} />
      {/each}
    </div>

    <div class="w-1/2 h-full max-h-screen print:hidden">
      <Editor
        bind:iframe
        stateId={"/sphero"}
        tabs={{ js: true }}
        hideIframe
        disabled={disableCodeEditing}
      />
      <button
        disabled={disableCodeEditing}
        onclick={() => drive(true)}
        class={`mt-4 disabled:bg-gray-800 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded`}
      >
        Run on Simulator
      </button>
      <button
        disabled={disableCodeEditing}
        onclick={() => drive(false)}
        class={`mt-4 disabled:bg-gray-800 bg-blue-500 hover:bg-blue-700 text-white ml-3 py-2 px-4 rounded`}
      >
        Run on Sphero
      </button>

      <div bind:this={simulatorContainer} class="simulator mt-4"></div>
    </div>
  </div>
</div>
