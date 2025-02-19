<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step0 from "./0_Introduction.svelte";
    import Step1 from "./1_CreateTable.svelte";
    import Step2 from "./2_StyleTable.svelte";
    import Step3 from "./3_UseUserLocation.svelte";
    import prependJavaScript from "./prepend.js?raw";
</script>

<Exercise
    title="Sortable Table"
    stateId="/exercises/sortable-table/v1"
    steps={[Step0, Step1, Step2, Step3]}
    prepend={{ html: "", css: "", js: prependJavaScript }}
></Exercise>
