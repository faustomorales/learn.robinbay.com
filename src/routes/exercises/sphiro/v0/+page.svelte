<script lang="ts">
    import Exercise from "$lib/components/Exercise.svelte";
    import Step0 from "./0_Introduction.svelte";

    var circle = `
    var driveInCircles = async (sphero) => {
    for (var circle=0; circle < 2; circle++) {
        for (var heading=0; heading < 360; heading += 10) {
        console.log(\`[DRIVE]: circle: \${circle}, heading: \${heading}\`)
        await sphero.roll(100, heading)
        await sphero.delay(25)
        }
    }
    sphero.roll(0, 0)
    }
    `;
</script>

<Exercise
    title="HTML Fundamentals"
    stateId="/exercises/sphiro/v0"
    steps={[Step0]}
></Exercise>

<style>
</style>
