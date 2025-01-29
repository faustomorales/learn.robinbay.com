<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications";
    let { step = $bindable() }: { step: Step } = $props();
    import { fail } from "$lib/common";
    const title = "HTML Parent and Child Elements";
    const verifier: Verifier = (iframe) => {
        let em = iframe.contentDocument?.querySelector("em");
        if (!em) {
            fail("No em elements were found. Did you use a div element?");
        } else if (em.textContent !== "Hello, World!") {
            fail("The em element should contain the text 'Hello, World!'");
        } else if (em.parentElement?.tagName !== "DIV") {
            fail("The em element should be a child of a div element.");
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        We can put HTML elements inside of other HTML elements. This is called <span
            class="font-mono">nesting</span
        >. The outer element is called the <span class="font-mono">parent</span>
        and the inner element is called the
        <span class="font-mono">child</span>. Below, we have an example of a
        parent div and a child span.
    </p>
    <div class="text-center font-mono p-2 m-2 bg-gray-100">
        {`<div><span></span></div>`}
    </div>
    <p>
        Please add a div to your page with an <span class="font-mono">em</span>
        element inside of it. Fill the <span class="font-mono">em</span> element
        with the text "Hello, World!". What does the
        <span class="font-mono">em</span> element do to the text?
    </p>
</Step>
