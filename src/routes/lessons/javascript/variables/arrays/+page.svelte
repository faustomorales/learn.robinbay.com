<script lang="ts">
    import SpheroExercise from "$lib/components/SpheroExercise.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import { ensureVariableExists } from "$lib/verifications.svelte";
    import Link from "$lib/components/Link.svelte";
    import { stringToColor } from "$lib/sphero/packets";
</script>

<SpheroExercise
    title="Robots Love Rainbows"
    subtitle="Lesson 3: Arrays"
    hints={[
        {
            mistake: "Using parentheses instead of square brackets",
            hint: 'Arrays must be created with <span class="font-mono">[ ]</span>, not <span class="font-mono">( )</span>. Example: <span class="font-mono">var colors = ["red", "green", "blue"];</span>',
        },
        {
            mistake:
                'Forgetting to use <span class="font-mono">var</span> when declaring the variable, like <span class="font-mono">delay = 2000;</span>',
            hint: 'Always use <span class="font-mono">var</span> when declaring a variable for the first time. You might find other resources telling you to use <span class="font-mono">let</span> or <span class="font-mono">const</span> but we need to use <span class="font-mono">var</span> for the automated system to work.',
        },
        {
            mistake: "Forgetting to use quotation marks around color names",
            hint: 'Each color is a string, so it must be inside quotation marks. Example: <span class="font-mono">var colors = ["red", "green", "blue"];</span>',
        },
        {
            mistake:
                'Misspelling or using the wrong case for the variable name or for <span class="font-mono">var</span>',
            hint: "JavaScript is case-sensitive, so the casing (and spelling) must be exactly correct.",
        },
    ]}
    prepend={{
        js: `
var drive = async (sphero) => {
var delay = 1000;
var index = 0;
await sphero.wake();
await sphero.delay(500);
while (index < colors.length) {
await sphero.setColor(colors[index]);
await sphero.delay(delay);
index = index + 1;
}
await sphero.delay(1000);
}
`,
    }}
    stateId="exercises/javscript/variables/arrays"
    precheck={(iframe) => {
        ensureVariableExists("colors", "array<string>", iframe).map(
            stringToColor,
        );
    }}
>
    {#snippet explanation()}
        <p class="mb-2">
            In programming, an array is a special type of variable that can
            store multiple values instead of just one. Think of it like a list
            or a row of boxes, where each box holds a piece of data. Arrays are
            useful when we need to keep track of many things at once, like a
            list of names, numbers, or colors.
        </p>
    {/snippet}

    {#snippet example()}
        Here’s an example of an array in JavaScript. This code contains a series
        of strings that could refer to people's names.

        <AnnotatedCode
            code={`var names = ["Alice", "Bob", "Sally"];`}
            language="js"
        />

        This array contains three names. Each color is written inside
        <span class="font-bold">quotation marks</span>
        (since they are strings, just as you learned in Lesson 1), and they are separated
        by
        <span class="font-bold">commas</span>
        inside <span class="font-bold">square brackets</span>. All arrays use
        this structure, no matter what type of data they store.
    {/snippet}

    {#snippet task()}
        <p class="mb-2">
            In Lesson 1, we made the ball light up with one color. In this
            lesson, you can provide an <CodeText>array</CodeText> of colors through
            which the ball will cycle. Write JavaScript code to create an array named
            <CodeText>colors</CodeText> that contains at least three different colors
            of your choice. See
            <Link
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color"
                >this page</Link
            > for a list of colors to choose from.
        </p>
    {/snippet}
</SpheroExercise>
