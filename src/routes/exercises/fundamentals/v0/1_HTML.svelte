<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="Define an HTML Element"
    verifier={(iframe) => {
        let div = iframe.contentDocument?.querySelector("div");
        if (!div) {
            fail("No div elements were found. Did you use a div element?");
        }
    }}
>
    <p>
        It all starts with HTML! HTML describes the structure of a web page.
        HTML elements always take the form of an opening tag and a closing tag.
        Below, we have an example of an opening and closing paragraph tag. This
        element is empty (because there's nothing between the opening and
        closing tag).
    </p>
    <div class="text-center font-mono p-2 m-2 bg-gray-100">
        {`<p></p>`}
    </div>
    <p>
        Please add an empty HTML <span class="font-mono">div</span> element to the
        page.
    </p>
</Step>
