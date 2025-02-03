<script lang="ts">
    import JSObject from "$lib/drawings/javascript-variable-object.svg?raw";
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="JavaScript: Objects"
    verifier={(iframe) => {
        let contentWindow = iframe.contentWindow as any;
        var increaseRoomWidth = contentWindow.increaseRoomWidth;
        var roomSettings = contentWindow.roomSettings;
        if (roomSettings === undefined) {
            fail("roomSettings does not appear to be defined.");
        }
        let roomSettingsType = typeof roomSettings;
        if (roomSettingsType !== "object") {
            fail(
                `roomSettings appears to be a ${roomSettingsType} instead of an object.`,
            );
        }
        if (roomSettings.color !== "yellow") {
            fail(
                `roomSettings.color should be "yellow" but is ${roomSettings.color}.`,
            );
        }
        roomSettings.width = 50;
        increaseRoomWidth();
        if (roomSettings.width !== 51) {
            fail(
                `roomSettings.width should be 51 after calling increaseRoomWidth, but it is ${roomSettings.width}.`,
            );
        }
    }}
>
    {#snippet solution()}
        <div class="flex justify-around mt-2">
            <pre class="mt-2">
{`var roomSettings = {
    color: "yellow",
    width: 50
}
var increaseRoomWidth = () => {
    roomWidth = roomWidth + 1;
    roomSettings.width = roomSettings.width + 1;
}
`}
</pre>
        </div>
    {/snippet}
    <p class="mb-4">
        Another type of variable is an object. In the same way that functions
        group instructions together, objects group information together. For
        example, you might want a single variable that indicates the first name,
        last name, and age of a user. It would be unwieldy to define three
        variables for each user and then keep track of them all. Objects helps
        us avoid this.
    </p>
    <div class="flex justify-around mt-2 mb-4">
        {@html JSObject}
    </div>
    <p class="mb-4">
        After defining an object, we can refer to its properties using dot
        notation with the keys. For the above example, we would expect <span
            class="font-mono">myVariable.myOtherProperty</span
        > to return 42.
    </p>
    <p class="mt-4">Okay, now it's your turn, please do the following.</p>
    <List>
        <li>
            Declare a variable named <span class="font-mono">roomSettings</span>
            that has two properties:

            <List>
                <li>
                    <span class="font-mono">color</span> with a value of
                    <span class="font-mono">"yellow"</span>
                </li>
                <li>
                    <span class="font-mono">width</span> with a value of
                    <span class="font-mono">50</span>
                </li>
            </List>
        </li>
        <li>
            Update the function body of <span class="font-mono"
                >increaseRoomWidth</span
            >
            to increase the value of
            <span class="font-mono">roomSettings.width</span>
            by 1, <span class="font-mono">in addition to</span> also increasing
            th value of <span class="font-mono">roomWidth</span> by 1. Normally,
            when we make a change like this (to use a single variable with two properties
            instead of two separate variables), we would remove the old functionality.
            However, we won't do that in this case because the automated check functionality
            in this tutorial needs the previous steps to still "pass" their test.
        </li>
    </List>
</Step>
