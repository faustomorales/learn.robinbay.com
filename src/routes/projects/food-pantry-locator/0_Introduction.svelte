<script lang="ts">
    import Final from "./Final.svelte";
    import Step from "$lib/components/Step.svelte";
    import Question from "$lib/components/Question.svelte";

    let { step = $bindable() }: { step: Step } = $props();
    let question: {
        stateId: string;
        question?: Question;
        options: { text: string; hint: string; correct: boolean }[];
        text: string;
    } = {
        stateId: "food-pantry-intro-1",
        question: undefined,
        options: [
            {
                text: "The table gets sorted by the user's distance to the food pantry.",
                hint: "Does the table order stay the same?",
                correct: true,
            },
            {
                text: "The addresses get converted into driving directions.",
                hint: "Did the addresses change?",
                correct: false,
            },
            {
                text: "The distance column gets populated.",
                hint: "Do the columns in the table change?",
                correct: true,
            },
        ],
        text: "What happens when you click the 'Sort by Distance' button?",
    };
</script>

<Step
    bind:this={step}
    title="Introduction"
    verifier={(iframe, initial) => {
        question.question?.verify(initial);
    }}
>
    <p class="mb-2">
        The goal of this project is to build a tool to help users find the
        nearest food pantry location. Below is an example of what we're
        building. Click on the button below the table to see how it uses your
        location to list food pantries near you.
    </p>
    <Final />
    <Question
        stateId={question.stateId}
        bind:this={question.question}
        width="w-full"
        options={question.options}><p>{question.text}</p></Question
    >
</Step>
