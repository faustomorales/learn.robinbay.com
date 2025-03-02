<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
    import { fail } from "$lib/common"
    import { ensureFunctionExists } from "$lib/verifications.svelte";
    let { step = $bindable() }: { step: Step } = $props()
    const title = "Create a function to generate rows";
    const verifier: Verifier = (iframe) => {
        let toRow = ensureFunctionExists(iframe, "toRow");
        let row = toRow({ first: "John", last: "Doe" });
        if (!row) {
            fail("The toRow function doesn't return anything.");
        } else if (!(row == "<tr><td>John</td><td>Doe</td></tr>")) {
            fail("The toRow function doesn't return a properly formatted row.");
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        Create a function that converts an item from the array into the syntax
        for an HTML table row element. The function should be called <em
            >toRow</em
        >
    </p></Step
>
