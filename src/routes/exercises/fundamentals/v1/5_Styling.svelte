<script lang="ts">
    import {
        verifyRoomStyling,
        expectedCssStyling,
        verifyHouseStyle,
    } from "./common";
    import Step from "$lib/components/Step.svelte";
    import Table from "$lib/components/Table.svelte";
    import Link from "$lib/components/Link.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="CSS: Styling Wrap-Up"
    verifier={(iframe) => verifyHouseStyle(iframe)}
>
    <p>
        We now need to finish styling the remaining elements. Please create CSS
        rules to apply the styling as laid out in this table. Note that you
        should probably group some of these to avoid writing them several times.
        For example, you may want to define the <span class="font-mono"
            >width</span
        >
        of <span class="font-mono">house</span>,
        <span class="font-mono">foundation</span>, and
        <span class="font-mono">roof</span> using a single rule.
    </p>
    <Table
        meta={[
            { key: "class", heading: "class" },
            { key: "selector", heading: "selector" },
            { key: "property", heading: "Property" },
            { key: "value", heading: "Value" },
        ]}
        data={expectedCssStyling.map((s) => ({
            ...s,
            selector: `.${s.class}`,
            class: s.class.split(":")[0],
        }))}
    ></Table>
    <p class="mt-2 mb-2">
        You probably have picked up on what the <span class="font-mono"
            >width</span
        >, <span class="font-mono">height</span>, and
        <span class="font-mono">background-color</span> properties do and how the
        selectors were defined (the . prefix chooses by class). But some of these
        probably deserve some explanation.
    </p>
    <Table
        meta={[
            { key: "selector", heading: "Selector" },
            { key: "property", heading: "Property and Value" },
            { key: "description", heading: "Description" },
        ]}
        data={[
            {
                selector: ".room:hover",
                property: "background-color: lightyellow",
                description:
                    "Sets a background color for the room class, but only when the user is hovering over it.",
            },
            {
                selector: ".interior",
                property: "display: flex",
                description:
                    "Makes the interior lay internal elements horizontally.",
            },
            {
                selector: ".interior",
                property: "justify-content: space-betwen",
                description:
                    "Puts space between the horizontal elements in the interior element.",
            },
        ]}
    ></Table>
    <p class="mt-2 mb-2">
        The <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/:hover"
            ><span class="font-mono">:hover</span></Link
        > pseudo-class is a common tool for communicating interactivity to a user.
        And the <Link
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex"
            ><span class="font-mono">flex</span></Link
        > layout is a common way to define the layout of elements along an axis.
        There are many ways to lay out HTML elements and we will explore them more
        in the future.
    </p></Step
>
