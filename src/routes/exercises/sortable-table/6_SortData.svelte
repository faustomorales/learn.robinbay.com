<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications";
    import { ensureFunctionExists } from "$lib/verifications";
    import { fail } from "$lib/common"
    let { step = $bindable() }: { step: Step } = $props()
    export const title = "Add a function to sort the table data";
    const verifier: Verifier = (iframe) => {
        let sort = ensureFunctionExists(iframe, "sort");
        if (sort([{ x: "b" }, { x: "a" }], "x")[0].x !== "a") {
            fail("The sort function doesn't sort the array correctly.");
        }
    };
</script>

<Step {title} {verifier} bind:this={step}
    >Create a function that creates a sorted version of the array on the basis
    of one of the attributes. To do this,
    <ul>
        <li>
            Create a function called <em>sort</em> that takes two arguments:
            <em>items</em>
            and <em>key</em>.
        </li>
        <li>
            Create a <em>compare</em> function within the sort function that
            takes two items and compares them based on the <em>key</em> using the
            localeCompare() method of strings.
        </li>
        <li>
            Use the toSorted method of the <em>items</em> array, which accepts a
            function that compares pairs of items and returns a number indicating
            their order.
        </li>
    </ul></Step
>
