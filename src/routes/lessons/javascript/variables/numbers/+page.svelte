<script lang="ts">
  import SpheroExercise from "$lib/components/SpheroExercise.svelte";
  import CodeText from "$lib/components/CodeText.svelte";
  import AnnotatedCodeV2 from "$lib/components/AnnotatedCode.svelte";
  import { ensureVariableExists } from "$lib/verifications.svelte";
</script>

<SpheroExercise
  title="Blink Twice If You're A Robot"
  subtitle="Lesson 2: Numbers"
  hints={[
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
>
  {#snippet explanation()}
    <p class="mb-2">
      Variables can store different types of information. In the last exercise,
      you used a variable to store a piece of text (a string). This time, you’ll
      create a variable to store a number. Numbers in JavaScript don’t need
      special symbols like quotation marks. You just write the number as it is.
    </p>
  {/snippet}

  {#snippet example()}
    <p class="mb-2">
      Here is an example of a number variable in JavaScript that stores the
      number 10. Hover over each part of the code to see what it does.
    </p>
    <AnnotatedCodeV2
      code={`[[ "id": "var", "text": "<code>var</code> tells JavaScript that you want to declare a variable." ]]var[[ "id": "var" ]] [[ "id": "myNumber", "text": "Indicates that the variable will have the name <code>myNumber</code>" ]]myNumber[[ "id": "myNumber"]] [[ "id": "equals", "text": "The = sign is the assignment operator. It assigns the value on the right to the variable on the left." ]]=[[ "id": "equals" ]] [[ "id": "10", "text": "The value assigned to the variable. In this case, the word \\\"Hello!\\\\" The quotes are important because they indicate the start and end of a string." ]]10[[ "id": "10" ]][[ "id": "semicolon", "text": "The semicolon is used to end a statement in JavaScript. It tells the computer that this is the end of the line of code." ]];[[ "id": "semicolon" ]]`}
      language="js"
      class="mb-2"
    />
  {/snippet}

  {#snippet task()}
    <p class="mb-2">
      Write a line of code to declare a variable called <CodeText
        >delay</CodeText
      > and set it to a number of your choice. This number will indicate how frequently
      the Sphero ball will change color. The number should be in milliseconds. For
      example, if you want the ball to change color every 2 seconds, you would set
      <CodeText>delay</CodeText> to 2000.
    </p>
  {/snippet}
</SpheroExercise>
