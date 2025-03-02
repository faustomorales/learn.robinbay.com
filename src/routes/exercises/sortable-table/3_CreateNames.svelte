<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common"
    let { step = $bindable() }: { step: Step } = $props()
    const title = "Create an array of names";
    const verifier: Verifier = (iframe) => {
        let data = (iframe.contentWindow as any)?.names;
        if (!data) {
            fail("The data array is missing.");
        } else if (
            !(
                Array.isArray(data) &&
                data.length > 0 &&
                data[0].first &&
                data[0].last
            )
        ) {
            fail("The data array doesn't have the correct structure.");
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>Create a JavaScript array of objects containing names.</p>
    <List>
        <li>The array's name should be <em>names</em>.</li>
        <li>
            Please declare the variable using <em>var</em> instead of
            <em>let</em>.
        </li>
        <li>
            Each object should have <em>first</em> and <em>last</em>
            properties.
        </li>
    </List>
</Step>
