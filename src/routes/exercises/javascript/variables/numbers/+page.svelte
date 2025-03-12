<script lang="ts">
    import Sphero from "$lib/components/Sphero.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import { ensureVariableExists } from "$lib/verifications.svelte";
    import Table from "$lib/components/Table.svelte";
</script>

<svelte:head>
    <title>Javascript :: Variables :: Numbers</title>
</svelte:head>

<div class="max-w-2xl mx-auto p-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-2">
            How do we use numbers in JavaScript?
        </h1>
        <p class="mb-2">
            Variables can store different types of information. In the last
            exercise, you used a variable to store a piece of text (a string).
            This time, you’ll create a variable to store a number. Numbers in
            JavaScript don’t need special symbols like quotation marks. You just
            write the number as it is.
        </p>
        <h2 class="text-xl font-bold mb-2 mt-3">Example</h2>
        <p class="mb-2">
            Here is an example of a number variable in JavaScript that stores
            the number 10. Hover over each part of the code to see what it does.
        </p>
        <AnnotatedCode
            code={`var myNumber = 10;`}
            tooltips={[
                {
                    from: 0,
                    to: 3,
                    text: `<span class="font-mono">var</span> tells JavaScript that you want to declare a variable.`,
                },
                {
                    from: 4,
                    to: 12,
                    text: `Indicates that the variable will have the name <span class="font-mono">myNumber</span>.`,
                },
                {
                    from: 13,
                    to: 14,
                    text: `The = sign is the assignment operator. It assigns the value on the right to the variable on the left.`,
                },
                {
                    from: 15,
                    to: 17,
                    text: `The value assigned to the variable. In this case, the word "Hello!" The quotes are important because they indicate the start and end of a string.`,
                },
                {
                    from: 17,
                    to: 19,
                    text: `The semicolon is used to end a statement in JavaScript. It tells the computer that this is the end of the line of code.`,
                },
            ]}
            language="javascript"
            class="mb-2"
        />
        <h2 class="text-xl font-bold mb-2 mt-3">Your Task</h2>
        <p class="mb-2">
            Write a line of code to declare a variable called <CodeText
                >delay</CodeText
            > and set it to a number of your choice. This number will indicate how
            frequently the Sphero ball will change color. The number should be in
            milliseconds. For example, if you want the ball to change color every
            2 seconds, you would set <CodeText>delay</CodeText> to 2000.
        </p>
        <Sphero
            stateId="exercises/javscript/variables/numbers"
            precheck={(iframe) => {
                let delay = ensureVariableExists("delay", "number", iframe);
                if (delay < 100) {
                    throw new Error(
                        "The delay should be at least 100 milliseconds (1/10 second).",
                    );
                }
                if (delay > 10000) {
                    throw new Error(
                        "The delay should be at most 10,000 milliseconds (10 seconds).",
                    );
                }
            }}
            prepend={{
                js: `
var drive = async (sphero) => {
    var colors = ["red", "green", "blue", "yellow", "purple"];
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
        />
        <details>
            <summary
                class="text-md font-bold text-gray-800 dark:text-gray-300 mb-2 mt-2"
            >
                Help! Something went wrong.
            </summary>
            <p>
                If you're having trouble with this exercise, here are some
                common mistakes and hints to help you out:
            </p>
            <Table
                meta={[
                    { key: "mistake", heading: "Mistake" },
                    { key: "hint", heading: "Hint" },
                ]}
                data={[
                    {
                        mistake:
                            'Using quotes around the number, like <span class="font-mono">var delay = "2000";</span>',
                        hint: 'Numbers should not have quotes. Remove them to make <span class="font-mono">delay</span> a number instead of a string.',
                    },
                    {
                        mistake:
                            'Forgetting to use <span class="font-mono">var</span> when declaring the variable, like <span class="font-mono">delay = 2000;</span>',
                        hint: 'Always use <span class="font-mono">var</span> when declaring a variable for the first time. You might find other resources telling you to use <span class="font-mono">let</span> or <span class="font-mono">const</span> but we need to use <span class="font-mono">var</span> for the automated system to work.',
                    },
                    {
                        mistake:
                            'Misspelling the variable name like <span class="font-mono">var dealy = 100</span>',
                        hint: "Check for typos! Variable names must match exactly.",
                    },
                    {
                        mistake:
                            'Using a decimal value instead of a whole number, like <span class="font-mono">var delay = 2000.5;</span>',
                        hint: 'Milliseconds should be whole numbers. Use a number like <span class="font-mono">2000</span> instead of a decimal.',
                    },
                    {
                        mistake:
                            'Using a negative number, like <span class="font-mono">var delay = -500;</span>',
                        hint: "Time delays can't be negative. Choose a positive number instead.",
                    },
                ]}
            />
        </details>
    </div>
</div>

<style>
</style>
