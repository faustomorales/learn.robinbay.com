<script lang="ts">
    import Step0 from "./0_Introduction.svelte";
    import Step1 from "./1_Elements.svelte";
    import Step2 from "./2_Elements.svelte";
    import Step3 from "./3_Styling.svelte";
    import Step4 from "./4_Styling.svelte";
    import Step5 from "./5_Styling.svelte";
    import Exercise from "$lib/components/Exercise.svelte";
</script>

<Exercise
    title="HTML Fundamentals"
    stateId="/exercises/fundamentals/html/v1"
    steps={[Step0, Step1, Step2, Step3, Step4, Step5]}
></Exercise>

<style>
    :global(.vocabulary) {
        z-index: 201; /* Ensure it's above the editor (200). */
    }
</style>
