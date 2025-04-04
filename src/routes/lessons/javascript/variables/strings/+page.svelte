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
    subtitle="Lesson 1: Strings"
    precheck={(iframe) => {
        let color = ensureVariableExists("color", "string", iframe);
        stringToColor(color);
    }}
    title="A Colorful Introduction"
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
            mistake: `Using the the wrong keyword to declare the variable (e.g., <span class="font-mono">let</span> or <span class="font-mono">const</span>).`,
            hint: `In these exercises, you should use the <span class="font-mono">var</span> keyword to declare the variable so that the automated checker will work.`,
        },
        {
            mistake: `Forgetting to use quotes around the color name (e.g., <span class="font-mono">var color = green;</span>)`,
            hint: `When the quotes are missing, JavaScript thinks you're trying to refer to a variable called <span class="font-mono">green</span> when you are actually just trying to set the value "green" as the contents of the variable <span class="font-mono">color</span>.`,
        },
        {
            mistake: `Making a minor typo (e.g., <span class="font-mono">bar</span> instead of <span class="font-mono">var</span> or <span class="font-mono">collor</span> instead of <span class="font-mono">color</span>).`,
            hint: "Check your spelling and make sure you use the correct variable name.",
        },
        {
            mistake: `Using an unsupported color name (e.g., <span class="font-mono">let color = "rainbow";</span>)`,
            hint: `Only certain colors work. Try a common color like "blue", "red", or "yellow".`,
        },
    ]}
>
    {#snippet explanation()}
        <p class="mb-2">
            In programming, a variable is a container that holds information.
            You can name the container and store something inside it, like a
            number or a word. When you need that information later, you can use
            the variable’s name to get it.
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
                    from: {
                        line: 1,
                        character: 0,
                    },
                    to: {
                        line: 1,
                        character: 3,
                    },
                    text: `<span class="font-mono">var</span> tells JavaScript that you want to declare a variable.`,
                    language: "js",
                },
                {
                    from: {
                        line: 1,
                        character: 4,
                    },
                    to: {
                        line: 1,
                        character: 11,
                    },
                    text: `Indicates that the variable will have the name <span class="font-mono">message</span>.`,
                    language: "js",
                },
                {
                    from: {
                        line: 1,
                        character: 12,
                    },
                    to: {
                        line: 1,
                        character: 13,
                    },
                    text: `The = sign is the assignment operator. It assigns the value on the right to the variable on the left.`,
                    language: "js",
                },
                {
                    from: {
                        line: 1,
                        character: 14,
                    },
                    to: {
                        line: 1,
                        character: 22,
                    },
                    text: `The value assigned to the variable. In this case, the word "Hello!" The quotes are important because they indicate the start and end of a string.`,
                    language: "js",
                },
                {
                    from: {
                        line: 1,
                        character: 22,
                    },
                    to: {
                        line: 1,
                        character: 24,
                    },
                    text: `The semicolon is used to end a statement in JavaScript. It tells the computer that this is the end of the line of code.`,
                    language: "js",
                },
            ]}
            language="js"
            class="mb-2"
        />
        <p class="mb-2">
            Once a variable has been <b>declared</b>, you can use it by
            referring to its variable name. You can also change its value using
            the <CodeText>=</CodeText> sign. Note that you <b>don't</b> need to
            use the <CodeText>var</CodeText> keyword again when changing the value
            of a variable. The <CodeText>var</CodeText> keyword is only used to initially
            declare the variable. Below, we change the value of the <CodeText
                >message</CodeText
            > variable to "Goodbye!".
        </p>
        <AnnotatedCode code={`message = "Goodbye!";`} language="js" />
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
