<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step1 from "./1_CreateTable.svelte";
    import Step2 from "./2_CreateHeadings.svelte";
    import Step3 from "./3_CreateNames.svelte";
    import Step4 from "./4_CreateRows.svelte";
    import Step5 from "./5_CreateTableBody.svelte";
    import Step6 from "./6_SortData.svelte";
    import Step7 from "./7_PopulateTable.svelte";
    import Step8 from "./8_SupportTableSorting.svelte";
    import Step9 from "./9_AddClickListener.svelte";
    import Final from "./Final.svelte";
</script>

<Exercise
    title="Sortable Table"
    stateId="/exercises/sortable-table"
    steps={[Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9]}
    ><div class="flex">
        <div class="w-3/4">
            <p class="mb-2">
                The goal of this exercise is to demonstrate how one can create a
                table that can be sorted by the user according to different
                columns. Follow the steps below and use the check button to
                verify your work. Ultimately, your work should like the example
                to the right (click on the first and last name headers to see
                the table re-sort).
            </p>
        </div>
        <div class="w-1/4">
            <Final />
        </div>
    </div></Exercise
>
