<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import type { Verifier } from "$lib/verifications";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
    const title = "Render the maze and run the robot";
    const verifier: Verifier = (iframe) => {
        if (!(iframe.contentWindow as any)?.executed) {
            fail("You need to execute the run function.");
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        Now use the run function to draw the maze and run the robot through it.
    </p>
</Step>
