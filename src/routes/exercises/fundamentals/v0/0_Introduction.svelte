<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    let { step = $bindable() }: { step: Step } = $props();
</script>

<Step bind:this={step} title="Introduction" verifier={() => {}}>
    <p class="mb-2">
        This exercise demonstrates some fundamentals of HTML, JavaScript, and
        CSS. Step through each part of the exercise to get practice!
    </p>
</Step>
