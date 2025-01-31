<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import Question from "$lib/components/Question.svelte";
    import Table from "$lib/components/Table.svelte";
    import Final from "./Final.svelte";
    let { step = $bindable() }: { step: Step } = $props();
    let questions: Question[] = $state([]);
    let definitions = [
        {
            component: `<span class="font-bold">HTML</span>`,
            provides: `<span class="italic">structure</span> of the house (e.g., foundation,
                            walls, rooms)`,
            consists: `HTML <span class="italic">elements</span>`,
        },
        {
            component: `<span class="font-bold">CSS</span>`,
            provides: `<span class="italic">look</span> of the house
                            (e.g., paint and decor)`,
            consists: `CSS <span class="italic">rules</span>`,
        },
        {
            component: `<span class="font-bold">JavaScript</span>`,
            provides: `<span class="italic">interaction</span> with
                            the house (e.g., make switches turn on lights)`,
            consists: `JavaScript <span class="italic"
                                >variables</span
                            >`,
        },
    ];
</script>

<Step
    title="Introduction: Components of a Web Page"
    bind:this={step}
    verifier={(iframe) => {
        questions.map((q) => q.verify());
    }}
>
    <div class="lg:flex mb-4">
        <div>
            <p class="mb-4">
                This lesson will walk you through the fundamentals of how web
                pages are built. They are made up of three different components
                (HTML, CSS, and JavaScript), which you might think of loosely as
                the components of a house.
            </p>
            <Table
                meta={[
                    { key: "component", heading: "" },
                    { key: "provides", heading: "... provides the" },
                    { key: "consists", heading: "... and consists of" },
                ]}
                data={definitions}
            />
        </div>
    </div>
    <p class="mb-4">
        Take a moment and play with the interactive house drawing below then
        answer the following three questions.
    </p>
    <div class="pb-4 pt-4 flex justify-around">
        <div class="final">
            <Final />
            <div class="text-xs text-gray-800 pt-2">
                By the end of this exercise, you will have built this
                interactive house using HTML, CSS, and JavaScript. Hover and
                click on the rooms to see what they do.
            </div>
        </div>
    </div>
    <hr class="mb-4 mt-4" />
    <div class="md:flex gap-10">
        <Question
            stateId="fundamentals-intro-q1"
            class="mb-4"
            bind:this={questions[0]}
            options={[
                {
                    text: "HTML",
                    correct: true,
                    hint: "What did the introduction say about HTML?",
                },
                {
                    text: "CSS",
                    correct: false,
                    hint: "CSS is sometimes used to define sizing and layout, but it is not typically used for structure.",
                },
                {
                    text: "JavaScript",
                    correct: false,
                    hint: "JavaScript is used for interactivity.",
                },
            ]}
            ><p>
                Which component is responsible for putting the roof above the
                interior, the interior above the foundation, and the rooms
                inside the interior?
            </p></Question
        >
        <Question
            stateId="fundamentals-intro-q2"
            class="mb-4"
            bind:this={questions[1]}
            options={[
                {
                    text: "HTML",
                    correct: false,
                    hint: "HTML provides structure, but is not typically where we define colors and fonts.",
                },
                {
                    text: "CSS",
                    correct: true,
                    hint: "CSS allows you to set rules for how things should look.",
                },
                {
                    text: "JavaScript",
                    correct: false,
                    hint: "JavaScript is used for interactivity.",
                },
            ]}
            ><p>
                Which component is most likely responsible for the color and
                fonts used for the different house elements?
            </p></Question
        >
        <Question
            stateId="fundamentals-intro-q3"
            class="mb-4"
            bind:this={questions[2]}
            options={[
                {
                    text: "HTML",
                    correct: false,
                    hint: "HTML provides structure, but rarely allows you to define interactive behavior.",
                },
                {
                    text: "CSS",
                    correct: false,
                    hint: "CSS is sometimes used for hover and animation effects, but its use for interactivity is limited.",
                },
                {
                    text: "JavaScript",
                    correct: true,
                    hint: "JavaScript is used for interactivity.",
                },
            ]}
            ><p>
                Which component is most likely responsible for the effect of
                hovering and clicking on the rooms?
            </p></Question
        >
    </div>
</Step>

<style>
    .final {
        width: 350px;
    }
</style>
