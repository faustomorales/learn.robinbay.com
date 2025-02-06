<script lang="ts">
    import JSFunction from "$lib/drawings/javascript-variable-function-1.svg?raw";
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="JavaScript, HTML, and CSS: Putting Them Together!"
    verifier={(iframe) => {
        let contentWindow = iframe.contentWindow as any;
        let contentDocument = iframe.contentDocument as any;
        let room = contentDocument.querySelector(".room");
        let turnOutLights = contentWindow.turnOutLights;
        if (!turnOutLights) {
            fail("The turnOutLights function is missing.");
        }
        let sentinel = { target: { style: { backgroundColor: "green" } } };
        turnOutLights(sentinel);
        if (sentinel.target.style.backgroundColor !== "black") {
            fail(
                "The turnOutLights function should change the value of event.target.style.backgroundColor to black.",
            );
        }
        room.click();
        if (room.style.backgroundColor !== "black") {
            fail("The HTML click handler isn't attached to turnOutLights correctly.");
        }
        room.style.backgroundColor = "yellow";
    }}
>
    {#snippet solution()}
        <div class="mt-2">
            <h3 class="font-bold">HTML</h3>
            <div class="flex justify-around mb-4">
                <pre
                    class="mt-1">{`<div class="room" onclick="turnOutLights(event)">Room</div>`}</pre>
            </div>
            <h3 class="font-bold">JavaScript</h3>
            <div class="flex justify-around">
                <pre class="mt-1">
{`var turnOutLights = (event) => {
    event.target.style.backgroundColor = "black";
}
`}
</pre>
            </div>
        </div>
    {/snippet}
    <p class="mb-4">
        So far, we have worked with HTML, CSS, and JavaScript separately. Let's
        implement the last part of this tutorial, where a user can click on a
        room and have "the lights go out." We can do this using <span
            class="font-bold">event handlers</span
        >. Event handlers are JavaScript functions that are called when an
        <span class="font-mono">event</span>. Examples of events include (but
        are not limited to):
    </p>
    <List>
        <li>A user clicking on an HTML element.</li>
        <li>A user hovering over an HTML element.</li>
        <li>A user moving the mouse over the page</li>
        <li>A user hitting a key on the keyboard</li>
    </List>

    <p class="mb-4">
        There are several ways to <span class="font-mono">attach</span> an event
        handler to an element. But one of the easiest is using
        <span class="font-mono">on<span class="italic">{"<event>"}</span></span>
        attributes.
    </p>

    <p class="mb-4">
        Please do the following to create your first event handler.
    </p>

    <List>
        <li>
            Declare a JavaScript function called <span class="font-mono"
                >turnOutlights</span
            > which accepts a single argument, called "event".
        </li>
        <li>
            Within the <span class="font-mono">turnOutlights</span> function
            body, re-assign the value of
            <span class="font-mono">event.target.style.backgroundColor</span>
            to be equal to <span class="font-mono">"black"</span>.
        </li>
        <li>
            Connect this handler to the HTML room elements by setting the <span
                class="font-mono">onclick</span
            >
            element of each room to
            <span class="font-mono">"turnOutlights(event)"</span>
        </li>
    </List>
</Step>
