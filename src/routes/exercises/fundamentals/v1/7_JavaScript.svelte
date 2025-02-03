<script lang="ts">
    import JSFunction from "$lib/drawings/javascript-variable-function-1.svg?raw";
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="JavaScript: Functions"
    verifier={(iframe) => {
        let contentWindow = iframe.contentWindow as any;
        var increaseRoomWidth = contentWindow.increaseRoomWidth;
        contentWindow.roomWidth = 50;
        if (increaseRoomWidth === undefined) {
            fail("increaseRoomWidth does not appear to be defined.");
        }
        let increaseRoomWidhType = typeof increaseRoomWidth;
        if (typeof increaseRoomWidth !== "function") {
            fail(
                `increaseRoomWidth appears to be a ${increaseRoomWidhType} instead of a function.`,
            );
        }
        increaseRoomWidth();
        if (contentWindow.roomWidth !== 51) {
            fail(
                `roomWidth should be 51 after calling increaseRoomWidth, but it is ${contentWindow.roomWidth}.`,
            );
        }
    }}
>
    {#snippet solution()}
        <div class="flex justify-around mt-2">
            <pre class="mt-2">
{`var increaseRoomWidth = () => {
    roomWidth = roomWidth + 1;
}
`}
</pre>
        </div>
    {/snippet}
    <p class="mb-4">
        Another type of variable is a function. Functions represent sets of
        instructions. Of course, most things in JavaScript are instruction
        (e.g., declare this variable, modify that variable). But functions allow
        us to package instrucions up so that they can be used multiple times
        without having to write the same code repeatedly. Here is the syntax for
        a function.
    </p>
    <div class="flex justify-around mt-2 mb-4">
        {@html JSFunction}
    </div>
    <p class="mb-4">
        If we ever want to execute the instructions in this function, we would <span
            class="font-bold">call</span
        >
        it by referring to the variable name and then giving it arguments using parentheses.
        For example, executing
        <span class="font-mono">myFunction(3, 4)</span> should return the value
        12. Note that the return statement at the end of the function is what
        determines what the function hands back to you (we would refer to you as
        the <span class="font-mono">caller</span> because you called the
        function). Functions don't <span class="font-mono">have</span> to return
        anything. When they don't, they are sometimes called
        <span class="font-mono">void</span> functions.
    </p>
    <p>
        Okay, now it's your turn, we'll declare a function that increases the
        value of <span class="font-mono">roomWidth</span> by 1.
    </p>
    <List>
        <li>
            Declare a function called increaseRoomWidth that that takes no
            arguments (so you'll just open and then immediately close the
            parentheses).
        </li>
        <li>
            Within the function body, re-assign the value of <span
                class="font-mono">roomWidth</span
            >
            to be equal to <span class="font-mono">roomWidth + 1</span>.
            Remember that you do not need to re-declare the variable (i.e., do
            not use the <span class="font-mono">var</span> keyword).
        </li>
    </List>
</Step>
