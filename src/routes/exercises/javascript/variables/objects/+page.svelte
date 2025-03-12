<script lang="ts">
    import SpheroExercise from "$lib/components/SpheroExercise.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import {
        ensureVariableExists,
        ensureVariableType,
    } from "$lib/verifications.svelte";
    import { stringToColor } from "$lib/sphero/packets";
</script>

<SpheroExercise
    title="Javascript :: Variables :: Objects"
    heading="How do we use objects in JavaScript?"
    hints={[
        {
            mistake: "Using square brackets instead of curly braces",
            hint: 'Objects must be created with <span class="font-mono">{ }</span>, not <span class="font-mono">[ ]</span>. Example: <span class="font-mono">var settings = { delay: 1000, colors: ["red", "green", "blue"] };</span>',
        },
        {
            mistake: "Forgetting to use var when declaring the object",
            hint: 'Always use <span class="font-mono">var</span> when declaring a variable for the first time. Example: <span class="font-mono">var settings = { delay: 1000, colors: ["red", "green", "blue"] };</span>',
        },
        {
            mistake:
                "Forgetting to use colons (:) between property names and values",
            hint: 'Each property in an object must use a colon, not an equals sign. Example: <span class="font-mono">var settings = { delay: 1000, colors: ["red", "green", "blue"] };</span>',
        },
        {
            mistake: "Accidentally adding a comma after the last property",
            hint: 'There should be no extra comma after the last property in an object. Example: <span class="font-mono">var settings = { delay: 1000, colors: ["red", "green", "blue"] };</span>',
        },
    ]}
    prepend={{
        js: `
var drive = async (sphero) => {
    var index = 0;
    await sphero.wake();
    await sphero.delay(500);
    while (index < settings.colors.length) {
        await sphero.setColor(settings.colors[index]);
        await sphero.delay(settings.delay);
        index = index + 1;
    }
    await sphero.delay(1000);
}
`,
    }}
    stateId="exercises/javascript/variables/objects"
    precheck={(iframe) => {
        let settings: any = ensureVariableExists("settings", "object", iframe);
        ensureVariableType("settings.delay", settings.delay, "number");
        ensureVariableType(
            "settings.colors",
            settings.colors,
            "array<string>",
        ).map(stringToColor);
    }}
>
    {#snippet explanation()}
        <p class="mb-2">
            In JavaScript, an <span class="font-bold">object</span> is a way to
            store multiple related pieces of data together. Instead of keeping
            separate variables for each value, we can group them into one object
            using <span class="font-mono">{"{"}{"}"}</span> curly braces.
        </p>
        <p class="mb-2">
            For example, if we want to store both a delay time and an array of
            colors, we can do it like this:
        </p>
        <AnnotatedCode
            code={`var settings = { delay: 1000, colors: ["red", "green", "blue"] };`}
            language="javascript"
        />
        <p class="mb-2">
            Objects use <span class="font-bold">key-value pairs</span>, where
            each key (like <CodeText>delay</CodeText>) is followed by a colon
            and its corresponding value. Properties inside an object are
            separated by commas.
        </p>
    {/snippet}

    {#snippet example()}
        Here’s how an object looks in JavaScript:

        <AnnotatedCode
            code={`var settings = { delay: 2000, colors: ["yellow", "purple", "cyan"] };`}
            language="javascript"
        />

        This object has two properties:
        <ul>
            <li>
                <CodeText>delay</CodeText>: A number representing milliseconds.
            </li>
            <li>
                <CodeText>colors</CodeText>: An array containing color names.
            </li>
        </ul>
    {/snippet}

    {#snippet task()}
        <p class="mb-2">
            Write JavaScript code to create an object named <CodeText
                >settings</CodeText
            > that has two properties:
        </p>
        <ul>
            <li>
                <CodeText>delay</CodeText>: A number representing the delay time
                in milliseconds.
            </li>
            <li>
                <CodeText>colors</CodeText>: An array containing at least three
                different colors of your choice.
            </li>
        </ul>
        <p class="mb-2">
            Make sure your object follows the correct syntax using <span
                class="font-mono">{"{"}{"}"}</span
            >
            and colons (<span class="font-mono">:</span>), and remember to
            separate properties with commas.
        </p>
    {/snippet}
</SpheroExercise>
