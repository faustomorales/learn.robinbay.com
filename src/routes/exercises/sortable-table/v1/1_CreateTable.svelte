<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import { fail } from "$lib/common";
    import type { Verifier } from "$lib/verifications";
    import Highlight from "svelte-highlight";
    import xml from "svelte-highlight/languages/xml";
    import List from "$lib/components/List.svelte";

    let { step = $bindable() }: { step: Step } = $props();
    const title = "HTML: Create Initial Table";
    let validations: { text: string; message?: string }[] = $state([
        { text: `There must be a table element.` },
        {
            text: `The table element must have a class of <span class="font-mono">food-pantries</span>`,
        },
        {
            text: `The table must contain two immediate children: <span class="font-mono">thead</span> (the table header) and <span class="font-mono">tbody</span> (the body of the table).`,
        },
        {
            text: `The <span class="font-mono">thead</span> element must contain a
            single child. That child should be a
            <span class="font-mono">tr</span> element.`,
        },
        {
            text: `The <span class="font-mono">tr</span> element within the
            <span class="font-mono">thead</span>
            element should have five immediate children, each of them being a
            <span class="font-mono">th</span> element.`,
        },
        {
            text: `The <span class="font-mono">th</span> elements should each contain the
            title for a column (i.e., name, hours, address, phone number, and distance).`,
        },
        {
            text: `The <span class="font-mono">tbody</span> element must contain three
            immediate children. Those children should each be a
            <span class="font-mono">tr</span> element.`,
        },
        {
            text: `The <span class="font-mono">tr</span> elements within the
            <span class="font-mono">tbody</span>
            element each represent a row in the table. They should each contain five
            <span class="font-mono">td</span> elements, one for each column in the
            table. The content of each column should be as shown in the previous
            example.`,
        },
        {
            text: `The button is a sibling of the table (i.e., it is not a child of the
            table). It should contain the text: "Sort by Distance" and have class "sort".`,
        },
    ]);
    const verifier: Verifier = (iframe) => {
        validations.forEach((validation) => (validation.message = ""));
        let table = iframe.contentDocument?.querySelector("table");
        let pantries = iframe.contentDocument?.querySelector(".food-pantries");
        let thead = pantries?.querySelector("thead");
        let theadtr = thead?.querySelector("tr");
        let tbody = pantries?.querySelector("tbody");
        let tbodychildren = tbody?.children;
        let tbodytrs = tbody?.querySelectorAll("tr");
        validations[0].message = table
            ? "✅ A table was found."
            : "❌ No table element was found.";
        validations[1].message = pantries
            ? "✅ Good work! I found a table with the correct class."
            : table
              ? "❌ I found a table but not one with the correct class."
              : "";
        validations[2].message = !pantries
            ? ""
            : pantries.children.length === 2
              ? thead && tbody
                  ? "✅ The table has the correct number of children and those children are the correct type."
                  : !thead
                    ? "❌ The table is missing a thead element."
                    : "❌ The table is missing a tbody element."
              : "❌ The table does not have the correct number of children.";
        validations[3].message = !thead
            ? ""
            : thead.children.length === 1
              ? thead.children[0].tagName === "TR"
                  ? "✅ The thead element has the correct number of children and those children are the correct type."
                  : "❌ The thead element does not have the correct type of children."
              : "❌ The thead element does not have the correct number of children.";
        validations[4].message = !theadtr
            ? ""
            : theadtr.children.length === 5
              ? [...theadtr.children].every((c) => c.tagName === "TH")
                  ? "✅ The tr element within the thead element has the correct number of children and those children are the correct type."
                  : `❌ The tr element within the thead element does not have the correct type of children (found types ${[...theadtr.children].map((c) => c.tagName.toLowerCase()).join(", ")} but expected types td, td, td, td, td).`
              : `❌ The tr element within the thead element does not have the correct number of children (found ${theadtr.children.length} but expected 5).`;
        let badheadings = (theadtr ? [...theadtr.children] : [])
            .map((c) => c.textContent || "")
            .filter(
                (c) =>
                    !["name", "hours", "address", "phone", "distance"].some(
                        (h) => c.toLowerCase().includes(h),
                    ),
            );
        validations[5].message = !theadtr
            ? ""
            : badheadings.length === 0
              ? "✅ The th elements contain the correct text."
              : `❌ The th elements do not contain the correct text (found ${badheadings.join(", ")}).`;
        validations[6].message = !tbody
            ? ""
            : tbodychildren
              ? tbodychildren.length === 3
                  ? tbodytrs && tbodytrs.length == 3
                      ? "✅ The tbody element has the correct number and type of children."
                      : `❌ The tbody element has the right number of children but they are not the correct type (expected them to all be tr but got ${[...tbodychildren].map((c) => c.tagName.toLowerCase()).join(", ")}).`
                  : `❌ The tbody element does not have the correct number of children (found ${tbodychildren.length} but expected 3).`
              : "❌ The tbody element is missing children.";
        validations[7].message = !tbodytrs
            ? ""
            : [...tbodytrs].every((tr) => {
                    let tds = tr.querySelectorAll("td");
                    return (
                        tds.length === 5 &&
                        [...tds].every((td) => td.tagName === "TD")
                    );
                })
              ? "✅ The tr elements within the tbody element have the correct number and type of children."
              : `❌ The tr elements within the tbody element do not have the correct number and type of children.`;
        let button = iframe.contentDocument?.querySelector("button");
        validations[8].message = button
            ? (button.textContent || "").trim().toLowerCase() ===
              "sort by distance"
                ? button.className === "sort"
                    ? "✅ The button has the correct text and class."
                    : "❌ The button does not have the correct class (expected 'sort' but found '${button.className}')."
                : `❌ The button does not have the correct text (expected "Sort by Distance" but found "${(button.textContent || "").trim()}").`
            : "❌ No button was found.";
        if (
            !validations.every((v) => v.message && v.message.startsWith("✅"))
        ) {
            fail("");
        }
    };
    let solutionCode = `<table class="food-pantries">
    <thead>
        <tr>
            <th>Name</th>
            <th>Hours</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Distance (miles)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Bethel Christian Church</td>
            <td>W, 6-9PM</td>
            <td>4600 NW 143rd Street, Gainesville, FL 32606</td>
            <td>(352) 575-6099</td>
            <td></td>
        </tr>
        <tr>
            <td>Catholic Charities, Inc.</td>
            <td>M-Th, 9:30AM–12:30PM and 1PM–3PM</td>
            <td>1717 NE 9th Street, Gainesville, 32609</td>
            <td>(352) 372-0294</td>
            <td></td>
        </tr>
        <tr>
            <td>Gainesville Community Ministry</td>
            <td>M-Th 9AM–2:45PM</td>
            <td>238 SW 4th Avenue, Gainesville, 32601</td>
            <td>(352) 372-8162</td>
            <td></td>
        </tr>
    </tbody>
</table>
<button>Sort by Distance</button>
`;
</script>

<Step bind:this={step} {title} {verifier}>
    <p class="mb-4">
        We start by constructing an HTML table and the button that will go
        beneath it. Below is a specification for these HTML elements.
    </p>
    <List tag="ol">
        {#each validations as validation}
            <li>
                {@html validation.text}
                <span class="italic text-gray-500 dark:text-gray-400"
                    >{@html validation.message}</span
                >
            </li>
        {/each}
    </List>
    <p class="mt-4 mb-4">
        Below is a diagram communicating the same ideas as above.
    </p>
    <div class="diagram font-mono">
        <div>
            table
            <div>
                <span class="label">thead</span>
                <div>
                    <span class="label">tr</span>
                    <div class="flex">
                        <div>th</div>
                        <div>th</div>
                        <div>th</div>
                        <div>th</div>
                        <div>th</div>
                    </div>
                </div>
            </div>
            <div>
                <span class="label">tbody</span>
                <div>
                    <span class="label">tr</span>
                    <div class="flex">
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                    </div>
                    <span class="label">tr</span>
                    <div class="flex">
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                    </div>
                    <span class="label">tr</span>
                    <div class="flex">
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                        <div>td</div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <span class="label">button</span>
        </div>
    </div>
    {#snippet solution()}
        <Highlight language={xml} code={solutionCode} class="mt-4" />
    {/snippet}
</Step>

<style>
    .diagram div {
        padding: 10px;
        border-collapse: collapse;
        border: 1px solid black;
    }
    .diagram div.flex div {
        flex-grow: 1;
    }
    .diagram .label {
        padding: 5px 5px 5px 0;
    }

    @media (prefers-color-scheme: dark) {
        .diagram div,
        .diagram {
            border-color: white;
        }
    }
</style>
