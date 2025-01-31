<script lang="ts">
    import { verifyRoomStyling } from "./common";
    import List from "$lib/components/List.svelte";
    import Step from "$lib/components/Step.svelte";
    import Table from "$lib/components/Table.svelte";
    import CSSDiagram from "$lib/drawings/css-rule.svg?raw";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="CSS: Styling Wrap-Up"
    verifier={(iframe) =>
        verifyRoomStyling(
            iframe,
            'Each room element should have a CSS rule set specifying "width: 100px; height: 50px; background-color: yellow;"',
        )}
>
    <p>
        We now need to finish styling the remaining elements. Please create CSS
        rules to apply the styling as laid out in this table.
    </p>
    <Table
        meta={[
            { key: "class", heading: "Class" },
            { key: "property", heading: "Property" },
            { key: "value", heading: "Value" },
        ]}
        data={[
            {
                class: `house`,
                property: `width`,
                value: `350px`,
            },
            {
                class: `foundation`,
                property: `width`,
                value: `350px`,
            },
            {
                class: `roof`,
                property: `width`,
                value: `350px`,
            },
            {
                class: `foundation`,
                property: `height`,
                value: `25px`,
            },
        ]}
    ></Table>
    <p class="mt-2 mb-2">
        You probably have picked up on what the <span class="font-mono"
            >width</span
        >, <span class="font-mono">height</span>, and
        <span class="font-mono">background-color</span> properties do. But some of
        these others probably deserve some explanation.
    </p>

</Step>
