<script lang="ts">
    import Table from "$lib/components/Table.svelte";
    import Step from "$lib/components/Step.svelte";
    import HouseBoxDiagram from "$lib/drawings/house-box-diagram.svg?raw";
    import Question from "$lib/components/Question.svelte";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    bind:this={step}
    title="HTML: Elements Wrap-Up"
    verifier={(iframe) => {
        let house = iframe.contentDocument?.querySelector(".house");
        if (!house) {
            fail("The house element is missing.");
        } else {
            let roof = house.querySelector(".roof");
            let foundation = house.querySelector(".foundation");
            let interior = house.querySelector(".interior");
            if (!roof) {
                fail("The roof element is missing.");
            }
            if (!foundation) {
                fail("The foundation element is missing.");
            }
            if (!interior) {
                fail("The interior element is missing.");
            } else {
                let rooms = interior.querySelectorAll(".room");
                if (rooms.length !== 3) {
                    fail(
                        "There should be 3 room elements inside the interior element.",
                    );
                }
            }
        }
    }}
>
    <p class="mb-4">
        For this next step, <span class="font-bold"
            >you will go ahead and build out the main structure for the house.</span
        >
        We will refer to each element according to its
        <span class="font-mono">class</span>
        attribute (since they will all be <span class="font-mono">div</span>
        elements and so that won't be a useful way to refer to them).
    </p>
    <p class="mb-4">
        The roof, interior, and foundation elements should be immediate children
        of the house element. And there should be three room elements that are
        each direct children of the interior element. They are also described
        below. To finish this step, create all your elements in the HTML code
        area to the right.
    </p>

    <div class="flex justify-around">
        <div>
            <div class="flex justify-around mt-2">
                {@html HouseBoxDiagram}
            </div>
            <div class="text-xs text-gray-800 text-center">
                Box Diagram of the House
            </div>
        </div>
        <Table
            meta={[
                { key: "class", heading: "class" },
                { key: "parent", heading: "parent" },
                { key: "content", heading: "content" },
            ]}
            data={[
                { class: "house", parent: "", content: "" },
                { class: "roof", parent: "house", content: "Roof" },
                { class: "interior", parent: "house", content: "" },
                { class: "foundation", parent: "house", content: "Foundation" },
                { class: "room", parent: "interior", content: "Room" },
            ]}
        ></Table>
    </div>
</Step>
