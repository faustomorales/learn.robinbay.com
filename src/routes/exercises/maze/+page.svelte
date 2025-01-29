<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import prependJavaScript from "./prepend.js?raw";
    import prependCss from "./prepend.css?raw";
    let prepend = {
        html: ``,
        css: prependCss,
        js: prependJavaScript,
    };
</script>

<Exercise stateId="/exercises/maze" title="Maze" steps={[]} {prepend}>
    <p class="pb-2">
        Make a robot run through a maze! In the JavaScript below, there is a <span
            class="font-mono">run</span
        >
        function that takes an array of commands (e.g.,
        <span class="font-mono">run(["down", "right", "left", "up"])</span>) and
        moves the robot accordingly. Can you get the robot to the end?
    </p>

    <p class="pb-2">
        The <span class="font-mono">run</span> function also accepts a second
        argument to specify the maze grid. The maze grid is defined using a
        string containing <span class="font-mono">x</span> and
        <span class="font-mono">o</span> values. For example, the default grid is
        the following:
    </p>
    <pre>
            "xoxxxxxx,xooooxxx,xxxxoxxx,xxxxooox,xxxxxxox,xxxxxxox,xxxxxxox,xxxxxxox,xxxxxxox"
        </pre>
    <p>Can you define your own maze?</p>
</Exercise>
