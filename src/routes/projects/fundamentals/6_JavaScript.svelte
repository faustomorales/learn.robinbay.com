<script lang="ts">
    import JSString from "$lib/drawings/javascript-variable-string.svg?raw";
    import JSNumber from "$lib/drawings/javascript-variable-number.svg?raw";
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="JavaScript: Strings and Numbers"
    verifier={(iframe) => {
        let contentWindow = iframe.contentWindow as any;
        let roomColor = contentWindow.roomColor;
        let roomWidth = contentWindow.roomWidth;
        let roomWidthType = typeof roomWidth;
        let roomColorType = typeof roomColor;
        if (roomColor === undefined) {
            fail("roomColor does not appear to be defined.");
        }
        if (roomWidth === undefined) {
            fail("roomWidth does not appear to be defined.");
        }
        if (typeof roomColor !== "string") {
            fail(
                `roomColor appears to be a ${roomColorType} instead of a string.`,
            );
        }
        if (roomWidthType !== "number") {
            fail(
                `roomWidth appears to be a ${roomWidthType} instead of a number.`,
            );
        }
    }}
>
    <p class="mb-4">
        We now move on to JavaScript. As we said at the start, JavaScript
        consists of variables and operations on those variables. Variables store
        information and functionality that we can access later.
    </p>
    <p>
        We'll start by declaring two kinds of variables: strings and numbers.
        Strings allow us to store textual information. Numbers allow us to count
        and perform calculations. Here is the syntax for a string.
    </p>
    <div class="flex justify-around mt-2 mb-4">
        {@html JSString}
    </div>
    <p>
        And here is the syntax for a number. Note that they are very similar!
        Note that we use the keyword <span class="font-mono">var</span> to
        declare the variable. However, if you wish to change a variable later
        on, you simply re-assign it using the equal sign
        <span class="bold">and you do not use var again.</span>
        You can think of the <span class="font-mono">var</span> keyword as meaning
        "I am declaring a new thing into existence" and the equal sign as saying
        "and this thing's value is ___". Naturally, once it exists you are free to
        change its value without declaring it again.
    </p>
    <div class="flex justify-around mt-2 mb-4">
        {@html JSNumber}
    </div>
    <p>Okay, your turn. Please do the following:</p>
    <List>
        <li>
            Declare a string variable called <span class="font-mono"
                >roomColor</span
            >
            and give it a value of "yellow".
        </li>
        <li>
            Declare a number variable called <span class="font-mono"
                >roomWidth</span
            > and give it a value of 50.
        </li>
    </List>
</Step>
