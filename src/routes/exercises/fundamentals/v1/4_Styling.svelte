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
    title="CSS: Styling Introduction"
    verifier={(iframe) =>
        verifyRoomStyling(
            iframe,
            'Each room element should have a CSS rule set specifying "width: 100px; height: 50px; background-color: yellow;"',
        )}
>
    <p>
        You might think that styling elements in HTML looks inelegant,
        especially with how we have to keep repeating the same style attributes.
        And that's why we use CSS. CSS allows you to declare a <span
            class="font-mono">rule</span
        > once and then apply it to a large number of elements. A CSS rule looks
        like the following.
    </p>
    <div class="flex justify-around mt-2 mb-2">
        {@html CSSDiagram}
    </div>
    <List>
        <li>
            <span class="font-bold">Selectors</span> indicate what elements will
            be affected by this rule. You can use multiple selectors to avoid repeating
            the same rule if it applies to multiple types of elements.
        </li>
        <li>
            <span class="font-bold">Property declarations</span> indicate what styles
            should be applied to those elements.
        </li>
    </List>
    <p class="mt-2 mb-2">
        CSS provides flexibility in how a developer can select elements for
        styling. You can select by class by prefixing it with a "." and you can
        select by tag name by using the tag name alone. You can also combine
        them together to create rules spanning tag name and class. Here are some
        examples.
    </p>
    <Table
        meta={[
            { key: "selector", heading: "Selector" },
            { key: "selects", heading: "will select ..." },
        ]}
        data={[
            {
                selector: `<span class="font-mono">p</span>`,
                selects: `Any <span class="font-mono">p</span> element, regardless of class.`,
            },
            {
                selector: `<span class="font-mono">div.car</span>`,
                selects: `Any <span class="font-mono">div</span> element with <span class="font-mono">class</span> car.`,
            },
            {
                selector: `<span class="font-mono">div.car.green</span>`,
                selects: `Any <span class="font-mono">div</span> element that has <span class="font-mono">class</span> car and green (i.e., an element can have more than one class by separating them with a space, such as with <span class="font-mono">class="car green"</span>).`,
            },
            {
                selector: `<span class="font-mono">div.car .seat</span>`,
                selects: `Any <span class="font-mono">div</span> element that has <span class="font-mono">class</span> seat and is inside a div element having <span class="font-mono">class</span> car.`,
            },
            {
                selector: `<span class="font-mono">.car .seat</span>`,
                selects: `Any element that has <span class="font-mono">class</span> seat and is inside an element having <span class="font-mono">class</span> car (does not matter if the containing element is a div or not).`,
            },
        ]}
    ></Table>
    <p class="mt-2 mb-2">
        There are also many CSS properties. The example shows two (<span
            class="font-mono">background-color</span
        >
        and <span class="font-mono">width</span>).
    </p>
    <p>
        For this next step, you should replace the styling from the last step
        with a CSS rule. Add a CSS rule that selects elements with <span
            class="font-mono">class</span
        >
        room (i.e., <span class="font-mono">.room</span>) and sets the width,
        height, and background-color properties to the same values as last time.
        Don't forget to refer to the required syntax above (especially the curly
        braces and semicolons).
    </p>
</Step>
