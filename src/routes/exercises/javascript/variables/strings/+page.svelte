<script lang="ts">
    import SpheroExercise from "$lib/components/SpheroExercise.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import { ensureVariableExists } from "$lib/verifications.svelte";
    import { stringToColor } from "$lib/sphero/packets";
    import Link from "$lib/components/Link.svelte";
</script>

<SpheroExercise
    stateId="exercises/javscript/variables/strings"
    precheck={(iframe) => {
        let color = ensureVariableExists("color", "string", iframe);
        stringToColor(color);
    }}
    heading="What Are Variables?"
    title="JavaScript :: Variables :: Strings"
    prepend={{
        js: `
var drive = async (sphero) => {
    await sphero.wake();
    await sphero.delay(500);
    await sphero.setColor(color);
    await sphero.delay(1000);
}
`,
    }}
    hints={[
        {
            mistake:
                "Using the the wrong keyword to declare the variable (e.g., let or const)",
            hint: `In this exercise, you should use the var keyword to declare the variable so that the automated checker will work.`,
        },
        {
            mistake: `Forgetting to use quotes around the color name (e.g., ar color = green;)`,
            hint: `Remember, color names are words (strings), so they need to be inside quotes: "green".`,
        },
        {
            mistake:
                "Making a minor typo (e.g., bar instead of var or collor instead of color).",
            hint: "Check your spelling and make sure you use the correct variable name.",
        },
        {
            mistake: `Using an unsupported color name (e.g., let color = "rainbow";)`,
            hint: `Only certain colors work. Try a common color like "blue", "red", or "yellow".`,
        },
    ]}
>
    {#snippet explanation()}
        <p class="mb-2">
            In programming, a variable is like a container that holds
            information. You can name the container and store something inside
            it, like a number or a word. When you need that information later,
            you can use the variable’s name to get it.
        </p>
        <p>
            Think of a variable like a sticky note. You can write something on
            it, stick it somewhere, and look at it when you need to remember
            what you wrote.
        </p>
    {/snippet}
    {#snippet example()}
        <p class="mb-2">
            Here is an example of a variable in JavaScript. This code creates a
            variable called message and stores the word "Hello!" inside it.
            Hover over each part of the code to see what it does.
        </p>
        <AnnotatedCode
            code={`var message = "Hello!";`}
            tooltips={[
                {
                    from: 0,
                    to: 3,
                    text: `<span class="font-mono">var</span> tells JavaScript that you want to declare a variable.`,
                },
                {
                    from: 4,
                    to: 11,
                    text: `Indicates that the variable will have the name <span class="font-mono">message</span>.`,
                },
                {
                    from: 12,
                    to: 13,
                    text: `The = sign is the assignment operator. It assigns the value on the right to the variable on the left.`,
                },
                {
                    from: 14,
                    to: 22,
                    text: `The value assigned to the variable. In this case, the word "Hello!" The quotes are important because they indicate the start and end of a string.`,
                },
                {
                    from: 22,
                    to: 24,
                    text: `The semicolon is used to end a statement in JavaScript. It tells the computer that this is the end of the line of code.`,
                },
            ]}
            language="javascript"
            class="mb-2"
        />
    {/snippet}
    {#snippet task()}
        <p class="mb-2">
            Create a variable called <CodeText>color</CodeText> and set it to the
            color you want the ball to turn. You can choose a color by writing its
            name inside quotes, like "blue" or "red". See
            <Link
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color"
                >this page</Link
            > for a list of colors to choose from.
        </p>
    {/snippet}
</SpheroExercise>
