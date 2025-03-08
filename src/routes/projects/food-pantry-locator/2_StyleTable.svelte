<script lang="ts">
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import { fail } from "$lib/common";
    import type { Verifier } from "$lib/verifications.svelte";

    let { step = $bindable() }: { step: Step } = $props();
    const title = "CSS: Style the Table";
    let validations: { text: string; message?: string }[] = $state([
        {
            text: `Use the <span class="font-mono">food-pantries</span> class as a selector and style it to have
            <span class="font-mono">font-family</span>
            set to <span class="font-mono">sans-serif</span>, <span class="font-mono">background-color</span>
            set to <span class="font-mono">white</span>, and <span class="font-mono">border-collapse</span>
            set to <span class="font-mono">collapse</span>.
            `,
        },
        {
            text: `Style the <span class="font-mono">td</span> and <span class="font-mono">th</span> elements
            within the <span class="font-mono">food-pantries</span> class to have <span class="font-mono">padding</span>
            set to <span class="font-mono">5px</span> and <span class="font-mono">border</span> set to
            <span class="font-mono">1px solid #ccc</span>. Remember that selector ".x y" selects
            elements with tag y inside any element with class x and that you can use a comma to
            separate multiple selectors.`,
        },
        {
            text: `Style the button element using the <span class="font-mono">sort</span> class to have
            <span class="font-mono">background-color</span> set to <span class="font-mono">darkblue</span>,
            <span class="font-mono">color</span> set to <span class="font-mono">white</span>,
            <span class="font-mono">margin-top</span> set to <span class="font-mono">5px</span>,
            <span class="font-mono">padding</span> set to <span class="font-mono">10px</span>.
            `,
        },
    ]);
    const verifier: Verifier = (iframe) => {
        let contentWindow = iframe.contentWindow;
        if (!contentWindow) return fail("No content window found");
        validations.forEach((validation) => (validation.message = ""));
        let pantries = iframe.contentDocument?.querySelector(".food-pantries");
        let button = iframe.contentDocument?.querySelector(".sort");
        let td = pantries ? pantries.querySelector("td") : undefined;
        let th = pantries ? pantries.querySelector("th") : undefined;
        if (pantries) {
            let badTableStyles = [
                {
                    property: "backgroundColor",
                    cssProperty: "background-color",
                    expected: "rgb(255, 255, 255)",
                    expectedHumanReadable: "white",
                },
                {
                    property: "borderCollapse",
                    cssProperty: "border-collapse",
                    expected: "collapse",
                },
                {
                    property: "fontFamily",
                    cssProperty: "font-family",
                    expected: "sans-serif",
                },
            ]
                .map((p) => ({
                    ...p,
                    actual: contentWindow?.getComputedStyle(pantries)[
                        p.property as any
                    ],
                }))
                .filter((p) => p.actual !== p.expected);
            validations[0].message =
                badTableStyles.length === 0
                    ? "✅ The table has the correct styling."
                    : `❌ The table has incorrect styling: (e.g., ${badTableStyles[0].cssProperty} is set to ${badTableStyles[0].actual} instead of ${badTableStyles[0].expectedHumanReadable || badTableStyles[0].expected}).`;
        } else {
            validations[0].message = "❌ The table was not found.";
        }
        if (td && th) {
            let badTdThStyles = [
                {
                    property: "padding",
                    expected: "5px",
                },
                {
                    property: "border",
                    expected: "1px solid rgb(204, 204, 204)",
                    expectedHumanReadable: "1px solid #ccc",
                },
            ]
                .map((p) => ({
                    ...p,
                    actualTD:
                        contentWindow?.getComputedStyle(td)[p.property as any],
                    actualTH:
                        contentWindow?.getComputedStyle(th)[p.property as any],
                }))
                .filter(
                    (p) =>
                        p.actualTD !== p.expected || p.actualTH !== p.expected,
                );
            validations[1].message =
                badTdThStyles.length === 0
                    ? "✅ The cell have the correct styling."
                    : `❌ The cells (td, th) have incorrect styling: (e.g., ${badTdThStyles[0].property} is set to ${badTdThStyles[0].actualTH} for th and ${badTdThStyles[0].actualTD} for td instead of ${badTdThStyles[0].expectedHumanReadable || badTdThStyles[0].expected}).`;
        } else {
            validations[1].message =
                "❌ The table cells or headings were not found.";
        }
        if (button) {
            let badButtonStyles = [
                {
                    property: "backgroundColor",
                    cssProperty: "background-color",
                    expected: "rgb(0, 0, 139)",
                    expectedHumanReadable: "darkblue",
                },
                {
                    property: "color",
                    expected: "rgb(255, 255, 255)",
                    expectedHumanReadable: "white",
                },
                {
                    property: "marginTop",
                    cssProperty: "margin-top",
                    expected: "5px",
                },
                {
                    property: "padding",
                    expected: "10px",
                },
            ]
                .map((p) => ({
                    ...p,
                    actual: contentWindow?.getComputedStyle(button)[
                        p.property as any
                    ],
                }))
                .filter((p) => p.actual !== p.expected);
            validations[2].message =
                badButtonStyles.length === 0
                    ? "✅ The button has the correct styling."
                    : `❌ The button has incorrect styling: (e.g., ${badButtonStyles[0].cssProperty || badButtonStyles[0].property} is set to ${badButtonStyles[0].actual} instead of ${badButtonStyles[0].expectedHumanReadable || badButtonStyles[0].expected}).`;
        } else {
            validations[2].message = "❌ The button was not found.";
        }
        if (
            !validations.every((v) => v.message && v.message.startsWith("✅"))
        ) {
            fail("");
        }
    };
    let solutionCode = `.food-pantries {
    font-family: sans-serif;
    border-collapse: collapse;
    background-color: white;
}

.food-pantries td, .food-pantries th {
    padding: 5px;
    border: 1px solid #ccc;
}
.sort {
    background-color: darkblue;
    color: white;
    margin-top: 5px;
    padding: 10px;
}`;
</script>

<Step {title} {verifier} bind:this={step}>
    <p class="mb-4">
        We now want to style the table and button to give it a more professional
        look. We will change the font, add some padding to the cells, and draw
        the borders. Add the following styles to the CSS.
    </p>

    <List tag="ol"
        >{#each validations as validation}
            <li>
                {@html validation.text}
                <span class="italic text-gray-500 dark:text-gray-400"
                    >{@html validation.message}</span
                >
            </li>{/each}</List
    >
    {#snippet solution()}
        <AnnotatedCode language="css" code={solutionCode} class="mt-4" />
    {/snippet}
</Step>
