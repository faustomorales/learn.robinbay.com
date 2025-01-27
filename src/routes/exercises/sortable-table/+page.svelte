<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";

    type VerificationResponse = { passed: boolean; comment: string };
    type Step = {
        description: string;
        verify: (iframe: HTMLIFrameElement) => VerificationResponse;
        response?: VerificationResponse;
    };

    let steps: Step[] = $state([
        {
            description: "Create a table element with class <em>my-table</em>.",
            verify: (iframe: HTMLIFrameElement) => {
                let table = iframe.contentDocument?.querySelector(".my-table");
                if (table) {
                    return { passed: true, comment: "" };
                } else {
                    let otherTable =
                        iframe.contentDocument?.querySelector("table");
                    if (otherTable) {
                        return {
                            passed: false,
                            comment:
                                "I found a table but not one with the correct class.",
                        };
                    } else {
                        return {
                            passed: false,
                            comment:
                                "No tables were found. Did you use a table element?",
                        };
                    }
                }
            },
        },
        {
            description: `Create thead and tbody elements inside the table. 
            The thead element should have elements for first name and last name. The first name
            header should have class <em>first</em> and the last name header should have
            class <em>last</em>.`,
            verify: (iframe: HTMLIFrameElement) => {
                let table = iframe.contentDocument?.querySelector(".my-table");
                let thead = table?.querySelector("thead");
                let tbody = table?.querySelector("tbody");
                let firstHeader = thead?.querySelector(".first");
                let lastHeader = thead?.querySelector(".last");
                if (thead && tbody && firstHeader && lastHeader) {
                    return { passed: true, comment: "" };
                } else {
                    return {
                        passed: false,
                        comment:
                            "I found a table but it's missing either thead or tbody or the first or last headers.",
                    };
                }
            },
        },
        {
            description: `Create a JavaScript array of objects containing names.
            <ul>
                <li>The array's name should be <em>names</em>.</li>
                <li>Please declare the variable using <em>var</em> instead of <em>let</em>.</li>
                <li>Each object should have <em>first</em> and <em>last</em> properties.</li>
            </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let data = (iframe.contentWindow as any)?.names;
                if (
                    data &&
                    Array.isArray(data) &&
                    data.length > 0 &&
                    data[0].first &&
                    data[0].last
                ) {
                    return { passed: true, comment: "" };
                } else if (!data) {
                    return {
                        passed: false,
                        comment: "The data array is missing.",
                    };
                } else {
                    return {
                        passed: false,
                        comment:
                            "The data array doesn't have the correct structure.",
                    };
                }
            },
        },
        {
            description:
                "Create a function that converts an item from the array into the syntax for an HTML table row element. The function should be called <em>toRow</em>",
            verify: (iframe: HTMLIFrameElement) => {
                let toRow = (iframe.contentWindow as any)?.toRow;
                if (toRow && typeof toRow === "function") {
                    let row = toRow({ first: "John", last: "Doe" });
                    if (row && row == "<tr><td>John</td><td>Doe</td></tr>") {
                        return { passed: true, comment: "" };
                    } else if (!row) {
                        return {
                            passed: false,
                            comment:
                                "The toRow function doesn't return anything.",
                        };
                    } else {
                        return {
                            passed: false,
                            comment:
                                "The toRow function doesn't return a properly formatted row.",
                        };
                    }
                } else {
                    return {
                        passed: false,
                        comment: "The toRow function is missing.",
                    };
                }
            },
        },
        {
            description: `Create a function that converts an array of items into the syntax for an HTML table body element.
                <ul>
                    <li>It should be called <em>toBody</em>.</li>
                    <li>It should accept an array of items as an argument.</li>
                    <li>It should return a string of table rows. You can do this by:
                        <ul>
                            <li>Calling the <em>map()</em> method on the array and passing the <em>toRow</em> function as the argument.</li>
                            <li>Joining the resulting array of strings into a single string using the <em>join()</em> method.</li>
                        </ul>
                </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let toBody = (iframe.contentWindow as any)?.toBody;
                if (toBody && typeof toBody === "function") {
                    let body = toBody([
                        { first: "John", last: "Doe" },
                        { first: "Jack", last: "Smith" },
                    ]);
                    if (
                        body &&
                        body ==
                            "<tr><td>John</td><td>Doe</td></tr><tr><td>Jack</td><td>Smith</td></tr>"
                    ) {
                        return { passed: true, comment: "" };
                    } else if (!body) {
                        return {
                            passed: false,
                            comment:
                                "The toBody function doesn't return anything.",
                        };
                    } else {
                        return {
                            passed: false,
                            comment:
                                "The toBody function doesn't return a properly formatted body.",
                        };
                    }
                } else {
                    return {
                        passed: false,
                        comment: "The toBody function is missing.",
                    };
                }
            },
        },
        {
            description: `Create a function that creates a sorted version of the array on the basis of one of the attributes. To do this,
                <ul>
                    <li>Create a function called <em>sort</em> that takes two arguments: <em>items</em> and <em>key</em>.</li>
                    <li>Create a <em>compare</em> function within the sort function that takes two items and compares them based on the <em>key</em> using the localeCompare() method of strings.</li>
                    <li>Use the toSorted method of the <em>items</em> array, which accepts a function that compares pairs of items and returns a number indicating their order.</li>
                </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let sort = (iframe.contentWindow as any)?.sort;
                if (sort && typeof sort === "function") {
                    if (sort([{ x: "b" }, { x: "a" }], "x")[0].x === "a") {
                        return { passed: true, comment: "" };
                    } else {
                        return {
                            passed: false,
                            comment:
                                "The sort function doesn't sort the array correctly.",
                        };
                    }
                } else {
                    return {
                        passed: false,
                        comment: "The sort function is missing.",
                    };
                }
            },
        },
        {
            description: `Create a function that populates the table with a string of rows. To do this,
                <ul>
                    <li>Create a function called <em>populate</em> that takes an array of items.</li>
                    <li>Get a reference to the <em>tbody</em> of the table and sets the innerHTML property to the result of calling toBody(items).</li>
                    <li>To initially populate the table, call the populate function when your page launches using <em>populate(names)</em>.</li>
                </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let table =
                    iframe.contentDocument?.querySelector(".my-table tbody");
                let rowCount = table!.querySelectorAll("tr").length > 0;
                if (rowCount) {
                    return { passed: true, comment: "" };
                } else {
                    return {
                        passed: false,
                        comment: "The table is empty. Did you add rows?",
                    };
                }
            },
        },
        {
            description: `Make your application support sorting. To do this,
            <ul>
            
                <li>Add a <em>sortKey</em> parameter to the <em>populate</em></li>
                <li>Use an if statement to choose whether to set the innerHTML of the table to one of the following:
                    <ul>
                        <li><em>toBody(sort(names, "first"))</em> if the sortKey parameter is "first"</li>
                        <li><em>toBody(sort(names, "last"))</em> if the sortKey parameter is "last"</li>
                        <li><em>toBody(names)</em> if the sortKey parameter is not set</li>
                    </ul>
                </li>
            </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let populate = (iframe.contentWindow as any)?.populate;
                let names = (iframe.contentWindow as any)?.names;
                let table =
                    iframe.contentDocument?.querySelector(".my-table tbody");
                let sort = (iframe.contentWindow as any)?.sort;
                if (populate && typeof populate === "function") {
                    populate(names, "");
                    if (
                        table?.querySelector("td")?.textContent !=
                        names[0].first
                    ) {
                        return {
                            passed: false,
                            comment:
                                "The table is not sorted according to the initial order when sortKey is unset.",
                        };
                    }
                    populate(names, "first");
                    if (
                        table?.querySelector("td")?.textContent !=
                        sort(names, "first")[0].first
                    ) {
                        return {
                            passed: false,
                            comment:
                                "The table is not sorted according to the first name when sortKey is set to 'first'.",
                        };
                    }
                    populate(names, "last");
                    if (
                        table?.querySelector("td")?.textContent !=
                        sort(names, "last")[0].first
                    ) {
                        return {
                            passed: false,
                            comment:
                                "The table is not sorted according to the last name when sortKey is set to 'last'.",
                        };
                    }
                    // populate(names)
                    return {
                        passed: true,
                        comment: "",
                    };
                } else {
                    return {
                        passed: false,
                        comment: "The populate function is missing.",
                    };
                }
            },
        },
        {
            description: `Add a click event listener to the table headers. You can do this by:
            <ul>
                <li>
                    Adding functions called <em>sortByFirstName</em> and <em>sortByLastName</em>
                    that call the <em>populate</em> function with the names list appropriate sort key.
                </li>
                <li>Adding event listeners to the first and last name headers (using <em>document.querySelector</em>
                to get the element and <em>addEventListener</em> to listen to the click event) that call the
                appropriate sort function when triggered.</li>
            </ul>`,
            verify: (iframe: HTMLIFrameElement) => {
                let table = iframe.contentDocument?.querySelector(".my-table");
                let tbody = table?.querySelector("tbody");
                let firstHeader = table?.querySelector(".first");
                let lastHeader = table?.querySelector(".last");
                let names = (iframe.contentWindow as any)?.names;
                let sort = (iframe.contentWindow as any)?.sort;

                (firstHeader as HTMLButtonElement)?.click();
                console.log("firstHeader", firstHeader);
                if (
                    tbody?.querySelector("td")?.textContent !=
                    sort(names, "first")[0].first
                ) {
                    return {
                        passed: false,
                        comment:
                            "The table is not sorted according to the first name when the first name header is clicked.",
                    };
                }
                (lastHeader as HTMLButtonElement)?.click();
                if (
                    tbody?.querySelector("td")?.textContent !=
                    sort(names, "last")[0].first
                ) {
                    return {
                        passed: false,
                        comment:
                            "The table is not sorted according to the last name when the last name header is clicked.",
                    };
                }
                return {
                    passed: true,
                    comment: "",
                };
            },
        },
    ]);

    let check = (iframe: HTMLIFrameElement) => {
        steps.reduce((failed: boolean, step) => {
            if (failed) {
                step.response = undefined;
                return true;
            } else {
                try {
                    step.response = step.verify(iframe);
                } catch (e) {
                    step.response = {
                        passed: false,
                        comment:
                            (e as any).message ||
                            "An error occurred performing this check. Please check the console.",
                    };
                }
                return !step.response.passed;
            }
        }, false);
    };
</script>

<svelte:head>
    <title>Sortable Table</title>
</svelte:head>

<h1>Sortable Table</h1>
<p>
    The goal of this exercise is to demonstrate how one can create a table that
    can be sorted by the user according to different columns. Follow the steps
    below and use the check button to verify your work.
</p>
<ol class="checks">
    {#each steps as step, i}
        <li>
            {step.response?.passed ? "✅" : "🟩"}
            {@html step.description}
            <em class="comment">{@html step.response?.comment}</em>
        </li>
    {/each}
</ol>

<Editor {check} />

<style>
    ol.checks {
        margin: 0;
        list-style: none;
        float: left;
    }
    em.comment {
        color: red;
    }
</style>
