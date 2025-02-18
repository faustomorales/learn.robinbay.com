<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step0 from "./0_Introduction.svelte";
    import Step1 from "./1_CreateTable.svelte";
    import Step2 from "./2_CreateHeadings.svelte";
    import Step3 from "./3_CreateNames.svelte";
    import Step4 from "./4_CreateRows.svelte";
    import Step5 from "./5_CreateTableBody.svelte";
    import Step6 from "./6_SortData.svelte";
    import Step7 from "./7_PopulateTable.svelte";
    import Step8 from "./8_SupportTableSorting.svelte";
    import Step9 from "./9_AddClickListener.svelte";
    import prependJavaScript from "./prepend.js?raw";
</script>

<Exercise
    title="Sortable Table"
    stateId="/exercises/sortable-table/v1"
    steps={[
        Step0,
        Step1,
        Step2,
        Step3,
        Step4,
        Step5,
        Step6,
        Step7,
        Step8,
        Step9,
    ]}
    prepend={{ html: "", css: "", js: prependJavaScript }}
></Exercise>
