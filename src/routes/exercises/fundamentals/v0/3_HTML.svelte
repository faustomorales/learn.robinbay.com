<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="HTML Attributes"
    verifier={(iframe) => {
        let possible = [
            ...(iframe.contentDocument?.querySelectorAll("span") || []),
        ];
        if (
            !possible.some(
                (s) => s.style.color === "red" && s.style.fontWeight === "bold",
            )
        ) {
            fail("No span elements were found. Did you use a span element?");
        }
    }}
>
    <p>
        HTML elements can have someting called attributes which change the
        behavior of the element. Note that the attribute is defined by
        specifying the attribute name in the opening tag and setting it using an
        "=" sign. For example, the following sets the <span class="font-mono"
            >fling</span
        >
        attribute of the
        <span class="font-mono">ding</span>
        element to the value <span class="font-mono">blop</span>.
    </p>
    <div class="text-center font-mono p-2 m-2 bg-gray-100">
        {'<ding fling="blop"></ding>'}
    </div>
    <p>
        One important attribute is the <span class="font-mono">style</span>
        attribute, which lets you change the way the element looks.
    </p>
    <div class="text-center font-mono p-2 m-2 bg-gray-100">
        {`<p style="color: green; font-weight: bold;">This text will be green.</p>`}
    </div>
    <p>
        The style attribute's syntax is
        <span class="font-mono">property1: value; property2: value</span>. Note
        that the separator between propreties is a semicolon.
    </p>
    <p>
        Please add a new span (<span class="font-mono">span</span>) element to
        the page. Use the style attribute to make the text bold and red.
    </p>
</Step>
