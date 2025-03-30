<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import type { Drivable } from "$lib/sphero/packets";
    import Hint from "$lib/components/Hint.svelte";
    import Sphero from "$lib/sphero/sphero";
    import SpheroMiniSimulator from "$lib/sphero/simulator";
    import { browser } from "$app/environment";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";

    let simulatorContainer: HTMLDivElement | undefined = $state(undefined);

    // Define an array to store rows in the table
    let error = $state("");
    let sphero: Sphero = $state(new Sphero());
    let ball: Drivable | undefined = $state(undefined);
    let stateId = "sphero/basic";
    let movements: { speed: string; direction: string; duration: string }[] =
        $state(
            browser &&
                JSON.parse(
                    localStorage.getItem(stateId) ||
                        JSON.stringify([
                            { speed: "", duration: "", direction: "" }, // Initial blank row
                        ]),
                ),
        );
    $effect(() => localStorage.setItem(stateId, JSON.stringify(movements)));
    let active: null | number = $state(null);
    const isNumerical = (value: string) => !isNaN(parseInt(value));
    let valid = $derived(
        movements.length > 0 &&
            movements.every(
                (movement) =>
                    isNumerical(movement.speed) &&
                    isNumerical(movement.duration) &&
                    isNumerical(movement.direction),
            ),
    );

    // Function to add a new movement
    const addMovement = () => {
        movements = [...movements, { speed: "", duration: "", direction: "" }];
    };
    const code = `
var drive = async (sphero, movements) => {
    await sphero.wake();
    await sphero.delay(500);
    await sphero.setColor(0, 255, 0);
    for (const movement of movements) {
        await sphero.roll(
            parseInt(movement.speed),
            parseInt(movement.direction),
        );
        await sphero.delay(parseInt(movement.duration));
    }
    await sphero.roll(0, parseInt(movements[movements.length - 1].direction));
    await sphero.setColor(255, 0, 0);
}
`.trim();
    const drive = async (simulate: boolean) => {
        error = "";
        try {
            ball = simulate
                ? new SpheroMiniSimulator(simulatorContainer!, [], [])
                : sphero;
            await ball.connect(navigator.bluetooth);
            await ball.wake();
            await ball.delay(500);
            if (!simulate) {
                await ball.aim(3000);
            }
            await ball.setColor(0, 255, 0);
            try {
                for (const [index, movement] of movements.entries()) {
                    active = index;
                    if (!ball) {
                        active = null;
                        return;
                    }
                    await ball!.roll(
                        parseInt(movement.speed),
                        parseInt(movement.direction),
                    );
                    await ball!.delay(parseInt(movement.duration));
                }
            } catch (e) {
                error = `${e}`;
            }
            active = null;
            await ball.roll(
                0,
                parseInt(movements[movements.length - 1].direction),
            );
            await ball.setColor(255, 0, 0);
            await ball.delay(500);
            await ball.sleep();
            await ball.disconnect();
        } catch (e) {
            error = `${e}`;
        }

        ball = undefined;
    };
    const buttons: {
        text: string;
        onclick: () => void;
        disabled: boolean;
        visible: boolean;
        color?: "red" | "blue";
    }[] = $derived([
        {
            text: "Add Movement",
            onclick: addMovement,
            disabled: !valid && movements.length >= 1,
            visible: !ball,
        },
        {
            text: "Run on Simulator",
            onclick: () => drive(true),
            disabled: !valid,
            visible: !ball,
        },
        {
            text: "Run on Sphero",
            onclick: () => drive(false),
            disabled: !valid,
            visible: !ball,
        },
        {
            text: "Stop Program",
            onclick: () => {
                ball?.roll(0, 0);
                ball?.delay(500);
                ball?.disconnect();
                active = null;
                ball = undefined;
            },
            color: "red",
            visible: ball !== undefined,
            disabled: false,
        },
    ]);
</script>

<svelte:head>
    <title>Sphero</title>
</svelte:head>

<div class="container mx-auto my-4 p-4">
    <h2 class="text-4xl font-bold">Sphero Playground</h2>
    <div class="flex gap-4 mt-4">
        <div class="w-1/2">
            <p>
                This application allows you to control a Sphero Mini by
                providing a list of movements defined by their direction, speed,
                and duration.
            </p>
            <table
                class="table-auto text-left table-auto font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
            >
                <thead>
                    <tr>
                        {#each ["Direction", "Speed", "Duration", ""] as direction}
                            <th
                                class="p-2 border-b border-blue-gray-100 bg-blue-gray-50"
                                >{direction}</th
                            >
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each movements as row, index}
                        <tr class={index === active ? "bg-blue-100" : ""}>
                            <td class="p-2 border-b">
                                <input
                                    type="text"
                                    bind:value={row.direction}
                                    class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter direction"
                                />
                            </td>
                            <td class="p-2 border-b">
                                <input
                                    type="text"
                                    bind:value={row.speed}
                                    class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter speed"
                                />
                            </td>
                            <td class="p-2 border-b">
                                <input
                                    type="text"
                                    bind:value={row.duration}
                                    class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter duration"
                                />
                            </td>
                            <td class="p-2 border-b">
                                <Button
                                    text="Delete"
                                    color="red"
                                    onclick={() =>
                                        (movements = movements
                                            .slice(0, index)
                                            .concat(
                                                movements.slice(index + 1),
                                            ))}
                                />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="w-1/2">
            <p class="mb-4">
                The movements in the table are executed using the following
                code.
            </p>
            <AnnotatedCode language="javascript" {code}></AnnotatedCode>
        </div>
    </div>
    <div class="flex gap-2 mt-4">
        {#each buttons as { text, onclick, disabled, visible, color }}
            {#if visible}
                <Button {text} {onclick} {disabled} {color}></Button>
            {/if}
        {/each}
    </div>
</div>
<Hint hint={error} className="text-red-500 p-2 font-mono text-xs" />

<div bind:this={simulatorContainer} class="simulator mt-4"></div>

<style>
    /* Optional: You can add some custom styles here */
</style>
