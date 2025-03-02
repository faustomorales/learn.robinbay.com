<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
    import { ensureFunctionExists } from "$lib/verifications.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
    export const title = "Create a function to generate the table body";
    const verifier: Verifier = (iframe) => {
        let toBody = ensureFunctionExists(iframe, "toBody");
        let expected =
            "<tr><td>John</td><td>Doe</td></tr><tr><td>Jack</td><td>Smith</td></tr>";
        let body = toBody([
            { first: "John", last: "Doe" },
            { first: "Jack", last: "Smith" },
        ]);
        if (!body) {
            fail("The toBody function doesn't return anything.");
        } else if (body !== expected) {
            fail(
                `The toBody function doesn't return a properly formatted body. Expected "${expected}" but got "${body}"".`,
            );
        }
    };
</script>

<Step {title} {verifier} bind:this={step}>
    <p>
        Create a function that converts an array of items into the syntax for an
        HTML table body element.
    </p>
    <List>
        <li>It should be called <em>toBody</em>.</li>
        <li>It should accept an array of items as an argument.</li>
        <li>
            It should return a string of table rows. You can do this by:
            <List>
                <li>
                    Calling the <em>map()</em> method on the array and passing
                    the <em>toRow</em> function as the argument.
                </li>
                <li>
                    Joining the resulting array of strings into a single string
                    using the <em>join()</em> method.
                </li>
            </List>
        </li>
    </List></Step
>
