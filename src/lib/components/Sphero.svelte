<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";
    import type { Drivable } from "$lib/sphero/packets";
    import SpheroMiniSimulator from "$lib/sphero/simulator";
    import Sphero from "$lib/sphero/sphero";
    import Hint from "$lib/components/Hint.svelte";
    let {
        stateId,
        hideTabs = true,
        prepend = { html: "", css: "", js: "" },
        precheck = (iframe) => null,
    }: {
        stateId: string;
        hideTabs?: boolean;
        precheck?: (iframe: HTMLIFrameElement) => void;
        prepend?: { html?: string; css?: string; js?: string };
    } = $props();
    let iframe: HTMLIFrameElement | undefined = $state(undefined);
    let simulatorContainer: HTMLDivElement | undefined = $state(undefined);
    let sphero: Sphero = $state(new Sphero());
    let error = $state("");
    let ball: Drivable | undefined = $state(undefined);
    const drive = async (
        simulate: boolean,
        simulatorContainer: HTMLDivElement,
        iframe: HTMLIFrameElement,
    ) => {
        error = "";
        try {
            if (!iframe) {
                throw new Error("No iframe found");
            }
            if (precheck) {
                precheck(iframe);
            }
            let window: {
                drive: (ball: Drivable) => Promise<any>;
                walls?: { x1: number; y1: number; x2: number; y2: number }[];
                platforms?: {
                    x1: number;
                    y1: number;
                    x2: number;
                    y2: number;
                }[];
            } = iframe.contentWindow! as any;
            if (typeof window.drive !== "function") {
                throw new Error("No drive function found");
            }
            let walls =
                window.walls &&
                typeof window.walls === "object" &&
                window.walls.length
                    ? window.walls
                    : [];
            let platforms =
                window.platforms &&
                typeof window.platforms === "object" &&
                window.platforms.length
                    ? window.platforms
                    : [];
            ball = simulate
                ? new SpheroMiniSimulator(simulatorContainer!, walls, platforms)
                : sphero;
            await ball.connect(navigator.bluetooth);
            try {
                await window.drive(ball);
            } catch (e) {
                error = `${e}`;
            }
            await ball.delay(500);
            await ball.sleep();
            await ball.disconnect();
        } catch (e) {
            error = `${e}`;
        }

        ball = undefined;
    };
</script>

<Editor
    bind:iframe
    {stateId}
    tabs={{ js: true }}
    hideIframe
    {prepend}
    readonly={ball !== undefined}
    {hideTabs}
/>
<Hint hint={error} className="text-red-500 p-2 font-mono text-xs" />

{#if ball}
    <button
        onclick={() => {
            ball?.roll(0, 0);
            ball?.delay(500);
            ball?.disconnect();
            iframe?.contentWindow?.location.reload();
            ball = undefined;
        }}
        class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded`}
        >Stop Program</button
    >
{:else}
    <button
        onclick={() => drive(true, simulatorContainer!, iframe!)}
        class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded`}
    >
        Run on Simulator
    </button>
    <button
        onclick={() => drive(false, simulatorContainer!, iframe!)}
        class={`mt-4 disabled:bg-gray-800 disabled:dark:bg-black bg-blue-500 hover:bg-blue-700 text-white ml-3 py-2 px-4 rounded`}
    >
        Run on Sphero
    </button>
{/if}

<div bind:this={simulatorContainer} class="simulator mt-4"></div>
