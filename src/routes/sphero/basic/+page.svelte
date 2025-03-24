<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import type { Drivable } from "$lib/sphero/packets";
    import Hint from "$lib/components/Hint.svelte";
    import Sphero from "$lib/sphero/sphero";
    import SpheroMiniSimulator from "$lib/sphero/simulator";
    import { browser } from "$app/environment";

    let simulatorContainer: HTMLDivElement | undefined = $state(undefined);

    // Define an array to store rows in the table
    let error = $state("");
    let sphero: Sphero = $state(new Sphero());
    let ball: Drivable | undefined = $state(undefined);
    let stateId = "sphero/basic";
    let rows: { speed: string; direction: string; duration: string }[] = $state(
        browser &&
            JSON.parse(
                localStorage.getItem(stateId) ||
                    JSON.stringify([
                        { speed: "", duration: "", direction: "" }, // Initial blank row
                    ]),
            ),
    );
    $effect(() => localStorage.setItem(stateId, JSON.stringify(rows)));
    const isNumerical = (value: string) => !isNaN(parseInt(value));
    let valid = $derived(
        rows.length > 0 &&
            rows.every(
                (row) =>
                    isNumerical(row.speed) &&
                    isNumerical(row.duration) &&
                    isNumerical(row.direction),
            ),
    );

    // Function to add a new row
    const addRow = () => {
        rows = [...rows, { speed: "", duration: "", direction: "" }];
    };
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
                ball.aim(3000);
            }
            await ball.setColor(0, 255, 0);
            try {
                for (const row of rows) {
                    await ball!.roll(
                        parseInt(row.speed),
                        parseInt(row.direction),
                    );
                    await ball!.delay(parseInt(row.duration));
                }
            } catch (e) {
                error = `${e}`;
            }
            await ball.roll(0, parseInt(rows[rows.length - 1].direction));
            await ball.setColor(255, 0, 0);
            await ball.delay(500);
            await ball.sleep();
            await ball.disconnect();
        } catch (e) {
            error = `${e}`;
        }

        ball = undefined;
    };
    const buttons = $derived([
        {
            text: "Add Movement",
            onclick: addRow,
            disabled: !valid && rows.length >= 1,
        },
        {
            text: "Run on Simulator",
            simulator: true,
            onclick: () => drive(true),
            disabled: !valid,
        },
        {
            text: "Run on Sphero",
            simulator: false,
            onclick: () => drive(false),
            disabled: !valid,
        },
    ]);
</script>

<svelte:head>
    <title>Sphero</title>
</svelte:head>

<div class="container mx-auto my-4 p-4">
    <h2 class="text-4xl font-bold">Sphero Playground</h2>
    <p class="mt-2">
        This application allows you to control a Sphero Mini by providing a list
        of movements defined by their speed, direction, and duration.
    </p>
    <table
        class="table-auto text-left table-auto font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
    >
        <thead>
            <tr>
                {#each ["Speed", "Duration", "Direction", ""] as direction}
                    <th
                        class="p-2 border-b border-blue-gray-100 bg-blue-gray-50"
                        >{direction}</th
                    >
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each rows as row, index}
                <tr>
                    <td class="px-4 py-2 border-b">
                        <input
                            type="text"
                            bind:value={row.speed}
                            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter speed"
                        />
                    </td>
                    <td class="px-4 py-2 border-b">
                        <input
                            type="text"
                            bind:value={row.duration}
                            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter duration"
                        />
                    </td>
                    <td class="px-4 py-2 border-b">
                        <input
                            type="text"
                            bind:value={row.direction}
                            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter direction"
                        />
                    </td>
                    <td class="px-4 py-2 border-b">
                        <Button
                            text="Delete"
                            color="red"
                            onclick={() =>
                                (rows = rows
                                    .slice(0, index)
                                    .concat(rows.slice(index + 1)))}
                        />
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <div class="flex gap-2 mt-4">
        {#each buttons as { text, onclick, disabled }}
            <Button {text} {onclick} {disabled}></Button>
        {/each}
    </div>
</div>
<Hint hint={error} className="text-red-500 p-2 font-mono text-xs" />

<div bind:this={simulatorContainer} class="simulator mt-4"></div>

<style>
    /* Optional: You can add some custom styles here */
</style>
