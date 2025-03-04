<script lang="ts">
    import Project from "$lib/components/Project.svelte";
    import Step0 from "./0_Introduction.svelte";
    import Step1 from "./1_CreateTable.svelte";
    import Step2 from "./2_StyleTable.svelte";
    import Step3 from "./3_UseUserLocation.svelte";
    import prependJavaScript from "./prepend.js?raw";
</script>

<Project
    title="Food Pantry Locator"
    stateId="/projects/sortable-table/v1"
    steps={[Step0, Step1, Step2, Step3]}
    prepend={{ html: "", css: "", js: prependJavaScript }}
></Project>
