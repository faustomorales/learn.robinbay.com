<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications";
    import { fail } from "$lib/common"
    let { step = $bindable() }: { step: Step } = $props()
    const title = "Create table heading and body";
    const verifier: Verifier = (iframe) => {
        let table = iframe.contentDocument?.querySelector(".my-table");
        let thead = table?.querySelector("thead");
        let tbody = table?.querySelector("tbody");
        let firstHeader = thead?.querySelector(".first");
        let lastHeader = thead?.querySelector(".last");
        if (!thead || !tbody || !firstHeader || !lastHeader) {
            fail("I found a table but it's missing either thead or tbody or the first or last headers.");
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        Create thead and tbody elements inside the table. The thead element
        should have elements for first name and last name. The first name header
        should have class <em>first</em> and the last name header should have
        class <em>last</em>.
    </p>
</Step>
