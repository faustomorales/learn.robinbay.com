<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step1 from "./1_CreateMazePlaceholders.svelte"
    import Step2 from "./2_Run.svelte"
    import prependJavaScript from "./prepend.js?raw";
    import prependCss from "./prepend.css?raw";
    let prepend = {
        html: ``,
        css: prependCss,
        js: prependJavaScript,
    };
</script>

<Exercise stateId="/exercises/maze" title="Maze" steps={[Step1, Step2]} {prepend}>
</Exercise>
