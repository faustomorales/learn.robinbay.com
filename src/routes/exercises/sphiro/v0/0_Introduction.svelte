<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import Question from "$lib/components/Question.svelte";
    import Final from "./Final.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step
    title="Introduction: Sphiro!"
    bind:this={step}
    verifier={(iframe) => {
        
    }}
>
    <div class="pb-4 pt-4 flex justify-around">
        <div class="final">
            <Final />
        </div>
    </div>
</Step>

<style>
    .final {
        width: 350px;
    }
</style>
