<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import type { Verifier } from "$lib/verifications.svelte";
    import solutionCodeJavaScript from "./final.js?raw";
    import { fail } from "$lib/common";
    import AnnotatedCode from "$lib/components/AnnotatedCode.svelte";
    let { step = $bindable() }: { step: Step } = $props();
    export const title = "JavaScript: Use User Location";
    let validations: { text: string; message?: string }[] = $state([
        {
            text: `Create a locations variable that stores the contents of the table as an array of objects.
            Each object should have the following properties: name, hours, address, phone, latitude, and longitude.
            You can get the latitude and longitude for each address by finding the address in Google Maps
            and right-clicking on the location to get the latitude and longitude.`,
        },
        {
            text: `Create a function called <em>populateByDistanceUsingPosition</em> that takes a <em>position</em> object
        and populates the table with the locations sorted by distance from the user's location. The <em>position</em> object
        will have a <em>coords</em> property that contains a <em>latitude</em> and <em>longitude</em> property. You
        can use the haversineDistanceMiles function to calculate the distance between two points on the Earth's surface.
        The signature for this function is (latitude1, longitude1, latitude2, longitude2) and it returns the distance
        between (latitude1, longitude1) and (latitude2, longitude2) in miles. You may want to make use of the map(), sort(), and forEach
        methods of arrays to accomplish this.`,
        },
        {
            text: `Create a function called <em>populateByDistance</em> that calls <em>navigator.geolocation.getCurrentPosition</em>
        with the <em>populateByDistanceUsingPosition</em> function as an argument.`,
        },
        {
            text: `Set the <em>onclick</em> property on the HTML button to <em>populateByDistance()</em>, so that this function gets executed upon clicking.`,
        },
    ]);
    const verifier: Verifier = (iframe) => {
        let contentWindow = iframe.contentWindow as any;
        if (!contentWindow) return fail("No content window found");
        validations.forEach((validation) => (validation.message = ""));
        validations[0].message = !contentWindow.locations
            ? "❌ The locations variable was not created."
            : contentWindow.locations.every(
                    (l: any) =>
                        l.name &&
                        l.hours &&
                        l.address &&
                        l.phone &&
                        l.latitude &&
                        l.longitude,
                )
              ? contentWindow.locations.every(
                    (l: any) =>
                        typeof l.latitude === "number" &&
                        typeof l.longitude === "number",
                )
                  ? "✅ The locations variable was created correctly."
                  : "❌ The latitude and longitude propeties must always be numbers."
              : "❌ The locations variable does not have the expected properties.";
        validations[1].message = !contentWindow.populateByDistanceUsingPosition
            ? "❌ The populateByDistanceUsingPosition function was not created."
            : contentWindow.populateByDistanceUsingPosition
                    .toString()
                    .includes("haversineDistanceMiles")
              ? "✅ The populateByDistanceUsingPosition function was found and appears to use the haversineDistanceMiles function."
              : "❌ The populateByDistanceUsingPosition function does not use the haversineDistanceMiles function.";
        validations[2].message = !contentWindow.populateByDistance
            ? "❌ The populateByDistance function was not created."
            : contentWindow.populateByDistance
                    .toString()
                    .includes("getCurrentPosition")
              ? "✅ The populateByDistance function was found and appears to use the getCurrentPosition function."
              : "❌ The populateByDistance function does not use the getCurrentPosition function.";
        let button = contentWindow.document.querySelector("button");
        validations[3].message = !button
            ? "❌ The button element was not found."
            : button.onclick &&
                button.onclick.toString().includes("populateByDistance")
              ? "✅ The button element was found and has the correct onclick property."
              : "❌ The button element does not have the correct onclick property.";
        if (
            !validations.every((v) => v.message && v.message.startsWith("✅"))
        ) {
            fail("");
        }
    };
</script>

<Step {title} {verifier} bind:this={step}>
    <p class="mb-4">
        We now wish to make our application interactive. We want it to compute
        the distances to each food pantry and sort the table accordingly. Below,
        when you create variables and functions, please use the <span
            class="font-mono">var</span
        >
        keyword so that the automatic checking code will work.
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
        <p class="font-medium mt-4 mb-1">JavaScript</p>
        <AnnotatedCode
            language="javascript"
            code={solutionCodeJavaScript.replace("// @ts-nocheck\n\n", "")}
        />
        <p class="font-medium mt-4 mb-1">HTML</p>
        <AnnotatedCode
            language="markup"
            code={`<button onclick="populateByDistance()" class="sort">Sort by Distance</button>`}
        />
    {/snippet}
</Step>
