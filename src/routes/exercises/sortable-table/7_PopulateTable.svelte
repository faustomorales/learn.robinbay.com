<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { fail } from "$lib/common"
    import type { Verifier } from "$lib/verifications";

    let { step = $bindable() }: { step: Step } = $props()
    const title = "Add a function that populates the table with rows";
    const verifier: Verifier = (iframe) => {
        let table = iframe.contentDocument?.querySelector(".my-table tbody");
        let rowCount = table!.querySelectorAll("tr").length > 0;
        if (!rowCount) {
            fail("The table is empty. Did you add rows?");
        }
    };
</script>

<Step {title} {verifier} bind:this={step}>
    <p>
        Create a function that populates the table with a string of rows. To do
        this,
    </p>
    <ul>
        <li>
            Create a function called <em>populate</em> that takes an array of items.
        </li>
        <li>
            Get a reference to the <em>tbody</em> of the table and sets the innerHTML
            property to the result of calling toBody(items).
        </li>
        <li>
            To initially populate the table, call the populate function when
            your page launches using <em>populate(names)</em>.
        </li>
    </ul>
</Step>
