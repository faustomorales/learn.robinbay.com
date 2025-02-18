<script lang="ts">
    import Final from "./Final.svelte";
    import Step from "$lib/components/Step.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step bind:this={step} title="Introduction" verifier={() => {}}>
    <div class="flex">
        <div class="w-3/4">
            <p class="mb-2">
                The goal of this exercise is to demonstrate how one can use the user's location to display a list of nearby locations.
            </p>
        </div>
        <div class="w-1/4">
            <Final />
        </div>
    </div>
</Step>
