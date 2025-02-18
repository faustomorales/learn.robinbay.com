<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { fail } from "$lib/common"
    import type { Verifier } from "$lib/verifications";
    let { step = $bindable() }: { step: Step } = $props()
    const title = "Create a table";
    const verifier: Verifier = (iframe) => {
        let table = iframe.contentDocument?.querySelector(".my-table");
        if (!table) {
            let otherTable = iframe.contentDocument?.querySelector("table");
            if (otherTable) {
                fail("I found a table but not one with the correct class.");
            } else {
                fail("No tables were found. Did you use a table element?");
            }
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        Create a table element with class <em>my-table</em>.
    </p>
</Step>
