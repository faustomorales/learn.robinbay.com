<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { ensureFunctionExists, type Verifier } from "$lib/verifications";

    let { step = $bindable() }: { step: Step } = $props()
    const title = "Make the table support sorting";
    const verifier: Verifier = (iframe) => {
        let populate = ensureFunctionExists(iframe, "populate");
        let sort = ensureFunctionExists(iframe, "sort");
        let names = (iframe.contentWindow as any)?.names;
        let table = iframe.contentDocument?.querySelector(".my-table tbody");
        populate(names, "");
        if (table?.querySelector("td")?.textContent != names[0].first) {
            throw "The table is not sorted according to the initial order when sortKey is unset.";
        }
        populate(names, "first");
        if (
            table?.querySelector("td")?.textContent !=
            sort(names, "first")[0].first
        ) {
            throw "The table is not sorted according to the first name when sortKey is set to 'first'.";
        }
        populate(names, "last");
        if (
            table?.querySelector("td")?.textContent !=
            sort(names, "last")[0].first
        ) {
            throw "The table is not sorted according to the last name when sortKey is set to 'last'.";
        }
        populate(names);
    };
</script>

<Step {title} {verifier} bind:this={step}>
    <p>Make your application support sorting. To do this,</p>
    <ul>
        <li>
            Add a <em>sortKey</em> parameter to the
            <em>populate</em>
        </li>
        <li>
            Use an if statement to choose whether to set the innerHTML of the
            table to one of the following:
            <ul>
                <li>
                    <em>toBody(sort(names, "first"))</em> if the sortKey parameter
                    is "first"
                </li>
                <li>
                    <em>toBody(sort(names, "last"))</em> if the sortKey parameter
                    is "last"
                </li>
                <li>
                    <em>toBody(names)</em> if the sortKey parameter is not set
                </li>
            </ul>
        </li>
    </ul>
</Step>
