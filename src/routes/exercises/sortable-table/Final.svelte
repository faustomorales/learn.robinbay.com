<script>
    // @ts-nocheck
    let js = `
    var names = [
        { first: "John", last: "Smith" },
        { first: "Sally", last: "Ride" },
        { first: "Bob", last: "Mitchell" },
        { first: "Barbara", last: "Walters" },
    ];

    function toRow(item) {
        return \`<tr><td>\${item.first}</td><td>\${item.last}</td></tr>\`;
    }

    function toBody(items) {
        return items.map(toRow).join("");
    }

    function populate(items, sortKey) {
        if (sortKey === "first") {
            items = sort(items, "first");
        } else if (sortKey === "last") {
            items = sort(items, "last");
        }
        let text = toBody(items);
        document.querySelector(".my-table tbody").innerHTML = text;
    }

    function sort(items, key) {
        function compare(a, b) {
            return a[key].localeCompare(b[key]);
        }
        return items.toSorted(compare);
    }

    function sortByFirstName() {
        populate(sort(names, "first"));
    }

    function sortByLastName() {
        populate(sort(names, "last"));
    }

    document
        .querySelector(".my-table thead td.first")
        .addEventListener("click", sortByFirstName);
    document
        .querySelector(".my-table thead td.last")
        .addEventListener("click", sortByLastName);

    populate(names);
    `;
    let css = "";
    let html = `
    <table class="my-table">
        <thead>
            <td class="first">First Name</td>
            <td class="last">Last Name</td>
        </thead>
        <tbody>
        </tbody>
    </table>`;
    let srcDoc = `
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<body>${html}</body>
		<style>${css}</style>
		<script>${js}<\/script>
		</html>`;
</script>

<iframe
    srcdoc={srcDoc}
    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
    title="output"
    frameborder="0"
></iframe>
