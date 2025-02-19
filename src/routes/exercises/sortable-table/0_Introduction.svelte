<script lang="ts">
    import Final from "./Final.svelte";
    import Step from "$lib/components/Step.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step bind:this={step} title="Introduction" verifier={() => {}}>
    <div class="flex">
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
    </div>
</Step>
