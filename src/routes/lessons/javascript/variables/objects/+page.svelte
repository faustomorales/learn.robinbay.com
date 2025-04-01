<script lang="ts">
    import SpheroExercise from "$lib/components/SpheroExercise.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import {
        ensureVariableExists,
        ensureVariableType,
    } from "$lib/verifications.svelte";
    import { stringToColor } from "$lib/sphero/packets";
    import List from "$lib/components/List.svelte";
</script>

<SpheroExercise
    title="Don't Use Two If One Will Do"
    subtitle="Lesson 4: Objects"
    hints={[
        {
            mistake: "Using square brackets instead of curly braces",
            hint: 'Objects must be created with <span class="font-mono">{ }</span>, not <span class="font-mono">[ ]</span>.',
        },
        {
            mistake: "Forgetting to use var when declaring the object",
            hint: 'Always use <span class="font-mono">var</span> when declaring a variable for the first time.',
        },
        {
            mistake:
                "Forgetting to use colons (:) between property names and values",
            hint: "Each property in an object must use a colon, not an equals sign.",
        },
        {
            mistake: "Accidentally adding a comma after the last property",
            hint: "There should be no extra comma after the last property in an object.",
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
            In JavaScript, an <span class="font-bold">object</span> is a way to store
            multiple related pieces of data together. Instead of keeping separate
            variables for each value, we can group them into one object.
        </p>
    {/snippet}

    {#snippet example()}
        <p class="mb-2">
            The snippet below shows code where we have related information
            spread across multiple variables. We <b>don't</b> want our code to
            look like this. It's cluttered, difficult to read, and that makes it
            easy to make mistakes. In fact, can you see the mistake in the code?
            <em>Hint: it's highlighted, so hover over it for an explanation.</em
            >
        </p>
        <AnnotatedCode
            code={`var nameOfPerson1 = "Hope";
var ageOfPerson1 = 25;
var eyeColorOfPerson1 = "brown";
var favoriteSnacksOfPerson1 = ["chips", "cookies", "fruit"];
var nameOfPerson2 = "Alex";
var ageOfPerson2 = 30;
var eyeColorOfPerson1 = "blue";
var favoriteSnacksOfPerson2 = ["candy", "popcorn", "nuts"];`}
            language="js"
            tooltips={[
                {
                    line: 7,
                    text: `eyeColorOfPerson1 is defined twice (on line 3 and here on line 7). We probably meant for this variable to be called <span class="font-mono"><b>eyeColorOfPerson2</b></span>.`,
                },
            ]}
        />
        <p class="mt-2 mb-2">
            Compare the above code (which uses eight number and string
            variables) to this cleaner version that uses two objects.
        </p>

        <AnnotatedCode
            code={`var person1 = {
    name: "Hope",
    age: 25,
    eyeColor: "brown",
    favoriteSnacks: ["chips", "cookies", "fruit"]
};
var person2 = {
    name: "Alex",
    age: 30,
    eyeColor: "blue",
    favoriteSnacks: ["candy", "popcorn", "nuts"]
};`}
            language="js"
        />
        <p class="mb-2 mt-2">
            Objects use <span class="font-bold">key-value pairs</span>, where
            each key (like <CodeText>eyeColor</CodeText>) is followed by a colon
            and its corresponding value. Properties inside an object are
            separated by commas.
        </p>
        <p class="mb-2">
            You might be wondering how we can access those properties now that
            they are nested inside of the object. In JavaScript, we access
            object properties using <b>dot notation</b>. That just means you use
            dots to get inside of an object. For example, <CodeText
                >person2.name</CodeText
            > will access the value "Alex".
        </p>
    {/snippet}

    {#snippet task()}
        <p class="mb-2">
            Write JavaScript code to create an object named <CodeText
                >settings</CodeText
            > that has two properties:
        </p>
        <List>
            <li>
                <CodeText>delay</CodeText>: A number representing the delay time
                in milliseconds. The ball will wait this many milliseconds
                before switching to a new color.
            </li>
            <li>
                <CodeText>colors</CodeText>: An array containing at least three
                different colors of your choice.
            </li>
        </List>
        <p class="mb-2 mt-2">
            Make sure your object follows the correct syntax using <span
                class="font-mono">{"{"}{"}"}</span
            >
            and colons (<span class="font-mono">:</span>), and remember to
            separate properties with commas.
        </p>
    {/snippet}
</SpheroExercise>
