<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import List from "$lib/components/List.svelte";
    import type { Verifier } from "$lib/verifications";
    import { fail } from "$lib/common";
    let { step = $bindable() }: { step: Step } = $props();
    const title = "Create maze and robot placeholders";
    const verifier: Verifier = (iframe) => {
        let game = iframe.contentDocument?.querySelector("#game");
        if (!game) {
            fail("No game elements were found. Did you use a game element?");
        } else {
            let maze = game.querySelector("#maze");
            let robot = game.querySelector("#robot");
            if (!maze) {
                fail(
                    "No maze element was found. Did you create a maze element?",
                );
            }
            if (!robot) {
                fail(
                    "No robot element was found. Did you create a robot element?",
                );
            }
        }
    };
</script>

<Step bind:this={step} {title} {verifier}>
    <p>
        This page has some built-in JavaScript to populate and style the maze,
        but I've left it to you to provide the base HTML elements. Please do the
        following:
    </p>
    <List>
        <li>Create a div element with ID "game"</li>
        <li>Within the game element, create a div element named "maze"</li>
        <li>Within the game element, create a div element named "robot"</li>
    </List>
</Step>
