<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step1 from "./1_HTML.svelte";
    import Step2 from "./2_HTML.svelte";
    import Step3 from "./3_HTML.svelte"
</script>

<Exercise
    title="JavaScript, HTML, and CSS Fundamentals"
    stateId="/exercises/fundamentals"
    steps={[Step1, Step2, Step3]}
>
    <div>
        <p class="mb-2">
            This exercise demonstrates some fundamentals of HTML, JavaScript,
            and CSS. Step through each part of the exercise to get practice!
        </p>
    </div>
</Exercise>
