<script lang="ts">
    import SpheroExercise from "$lib/components/SpheroExercise.svelte";
    import CodeText from "$lib/components/CodeText.svelte";
    import List from "$lib/components/List.svelte";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import { ensureVariableExists, ensureVariableType } from "$lib/verifications.svelte";
</script>

<SpheroExercise
    title="Color in Motion"
    subtitle="Lesson 5: Arrays of Objects"
    hints={[
        {
            mistake: "Using parentheses instead of curly braces for objects",
            hint: 'Objects must be created with <span class="font-mono">{ }</span>, not <span class="font-mono">( )</span>. Example: <span class="font-mono">{ color: "red", heading: 90, duration: 50, speed: 200 }</span>',
        },
        {
            mistake: "Forgetting commas between object properties",
            hint: 'Each property in an object must be separated by a comma. Example: <span class="font-mono">{ color: "red", heading: 90, duration: 500, speed: 200 }</span>',
        },
        {
            mistake: "Using incorrect property names",
            hint: 'Ensure the object properties are named exactly as specified: <span class="font-mono">color</span>, <span class="font-mono">heading</span>, <span class="font-mono">duration</span>, and <span class="font-mono">speed</span>.',
        },
    ]}
    prepend={{
        js: `var platforms = [
  {x1: 4, y1: 16, x2: 6, y2: 18},
  {x1: 6, y1: 10, x2: 8, y2: 12},
  {x1: 10, y1: 14, x2: 12, y2: 16},
  {x1: 10, y1: 18, x2: 12, y2: 20},
  {x1: 14, y1: 8, x2: 16, y2: 10}
];
var drive = async (sphero) => {
    await sphero.wake();
    await sphero.delay(500);
    for (var i = 0; i < movements.length; i++) {
        var move = movements[i];
        await sphero.setColor(move.color);
        await sphero.roll(move.speed, move.heading);
        await sphero.delay(move.duration);
    }
    await sphero.delay(1000);
}
`,
    }}
    stateId="exercises/javascript/objects/arrays"
    precheck={(iframe) => {
        var movements = ensureVariableExists("movements", "array<object>", iframe);
        movements.map((movement: any, index) => {
            ensureVariableType(`item ${index} in movements`, movement, "object");
            ensureVariableType(`color in item ${index} in movements`, movement.color, "string");
            ensureVariableType(`heading in item ${index} in movements`, movement.heading, "number");
            ensureVariableType(`speed in item ${index} in movements`, movement.speed, "number");
            ensureVariableType(`duration in item ${index} in movements`, movement.duration, "number");
        })
        if (movements.length < 3) {
            throw new Error(`You must define at least three movements. Only ${movements.length} were found.`);
        }
    }}
>
    {#snippet explanation()}
        <p class="mb-2">
            In this lesson, you'll see how to combine arrays and objects in
            JavaScript. An object can hold multiple properties and an array can
            store multiple items. These are fundamental data structures that we can use to represent all kinds of information.
        </p>
    {/snippet}

    {#snippet example()}
        <p class="mb-2">
            Here is an example of an array consisting of a series of objects.
            This array would likely be used by a programmer to represent an
            array of people.
        </p>
        <AnnotatedCode
            code={`var people = [
    { name: "Alice", age: 20 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 30 }
];`}
            language="js"
        />
    {/snippet}

    {#snippet task()}
        <p class="mb-2">
            Create a variable called <CodeText>movements</CodeText> that is an array
            of objects. Each object should have all of the following properties:</p>
            <List>
                <li><CodeText>color</CodeText>, a string representing what the ball's color should be during this movement.</li>
                <li><CodeText>speed</CodeText>, a number between 0 and 255 indicating how fast the ball should roll.</li>
                <li><CodeText>duration</CodeText>, a number representing how long this movement should occur, in milliseconds. So setting it to 500 will result in the ball moving for half a second.</li>
                <li><CodeText>heading</CodeText>, a number between 0 and 360 indicating what direction the ball should roll, defined as the number of degrees going clockwise from the right. In other words, a heading of 0 will cause the ball to roll to the right. A heading of 180 will cause it to roll to the left. 90 causes it to roll down. And 270 causes it to roll up.</li>
            </List>
       <p class="mb-2 mt-2">Define at least three different movements for your robot ball. <em>As an extra challenge, see if you can get the ball to roll over all of the red platforms that now appear in the simulator.</em></p>
    {/snippet}
</SpheroExercise>
