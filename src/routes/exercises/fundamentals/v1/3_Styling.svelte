<script lang="ts">
    import { verifyRoomStyling } from "./common";
    import Step from "$lib/components/Step.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="HTML: Inline Styling"
    verifier={(iframe) =>
        verifyRoomStyling(
            iframe,
            'Each room element should have a style attribute with the value "width: 100px; height: 50px; background-color: yellow;"',
        )}
>
    <p>
        Before we move on from HTML over to CSS, let's take a look at how we can
        style our HTML elements. At the start, we said that styling is done with
        CSS. But the lines are actually a little blurry. We can use the style
        attribute to add inline styles to our elements.
    </p>
    <p>
        For this step, please add a style attribute to each of the room elements
        in the HTML. The value should be the same for all of them:
    </p>
    <p class="text-center mt-4 mb-4">
        <span class="font-mono"
            >width: 100px; height: 50px; background-color: yellow;"</span
        >
    </p>
    <p>
        You might find yourself with overly long lines of code. Note that, in
        HTML <span class="bold"
            >you can insert a line break anywhere a space would normally go.</span
        >
    </p>
</Step>
