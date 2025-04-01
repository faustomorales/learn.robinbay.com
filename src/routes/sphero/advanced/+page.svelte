<script lang="ts">
  import documentation from "./documentation";
  import Sphero from "$lib/components/Sphero.svelte";
  import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";

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
    <div
      class="w-1/2 max-h-screen overflow-y-auto mb-6 print:w-full print:max-h-full"
    >
      <h2 class="text-4xl font-bold">Sphero Playground</h2>
      <p class="mt-2">
        This application allows you to control a Sphero Mini using JavaScript.
        You can do this by providing a JavaScript code snippet that includes an
        async function called <span class="font-mono font-bold">drive</span> which
        will be called with a single argument that represents the Sphero ball.
      </p>
      <AnnotatedCode
        class="mt-2"
        language="js"
        code={sampleCode.trim()}
      />
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
        <AnnotatedCode class="mt-2" language="js" code={code.trim()} />
      {/each}
    </div>

    <div class="w-1/2 h-full max-h-screen print:hidden">
      <Sphero stateId="/sphero" />
    </div>
  </div>
</div>
