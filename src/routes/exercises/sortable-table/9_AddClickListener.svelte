<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
    import { fail } from "$lib/common";
    import List from "$lib/components/List.svelte";

    let { step = $bindable() }: { step: Step } = $props();
    const title = "Add a click event listener to the table headers";

    const verifier: Verifier = (iframe) => {
        let table = iframe.contentDocument?.querySelector(".my-table");
        let tbody = table?.querySelector("tbody");
        let firstHeader = table?.querySelector(".first");
        let lastHeader = table?.querySelector(".last");
        let names = (iframe.contentWindow as any)?.names;
        let sort = (iframe.contentWindow as any)?.sort;
        (firstHeader as HTMLButtonElement)?.click();
        if (
            tbody?.querySelector("td")?.textContent !=
            sort(names, "first")[0].first
        ) {
            fail(
                "The table is not sorted according to the first name when the first name header is clicked.",
            );
        }
        (lastHeader as HTMLButtonElement)?.click();
        if (
            tbody?.querySelector("td")?.textContent !=
            sort(names, "last")[0].first
        ) {
            fail(
                "The table is not sorted according to the last name when the last name header is clicked.",
            );
        }
    };
</script>

<Step {title} {verifier} bind:this={step}>
    <p>Add a click event listener to the table headers. You can do this by:</p>
    <List>
        <li>
            Adding functions called <em>sortByFirstName</em> and
            <em>sortByLastName</em>
            that call the <em>populate</em> function with the names list appropriate
            sort key.
        </li>
        <li>
            Adding event listeners to the first and last name headers (using <em
                >document.querySelector</em
            >
            to get the element and <em>addEventListener</em> to listen to the click
            event) that call the appropriate sort function when triggered.
        </li>
    </List>
</Step>
