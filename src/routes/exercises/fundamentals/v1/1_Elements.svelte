<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import Question from "$lib/components/Question.svelte";
    import AnatomyDiagram from "$lib/drawings/html-element.svg?raw";
    import AnatomyDiagramNested from "$lib/drawings/html-element-nested.svg?raw";
    import { fail } from "$lib/common";
    import List from "$lib/components/List.svelte";
    let { step = $bindable() }: { step: Step } = $props();
    let questions: Question[] = $state([]);
</script>

<Step
    bind:this={step}
    title="HTML: Elements Introduction"
    verifier={(iframe) => {
        questions.map((q) => q.verify());
        iframe.contentDocument?.querySelector(".example") ||
            fail("The example element is missing.");
    }}
>
    <p>
        All HTML code consists of elements. The diagram below shows the
        structure of an HTML element.
    </p>
    <div class="flex justify-around mt-2">
        {@html AnatomyDiagram}
    </div>
    <div class="text-xs text-gray-800 pt-2 text-center">
        Example 1: Plain HTML Element
    </div>
    <p class="mt-4 mb-4">
        Example 1 is of a single HTML element. But HTML elements can be nested
        within each other, creating child and parent relationships. In example
        2, we have a <span class="font-mono">p</span> element nested within a
        <span class="font-mono">div</span> element. You could also refer to the child
        element as the content of the parent element.
    </p>
    <div class="flex justify-around mt-2">
        {@html AnatomyDiagramNested}
    </div>
    <div class="text-xs text-gray-800 text-center">
        Example 2: Nested HTML Element
    </div>
    <p class="mt-4 mb-4">
        The above also shows examples of setting attributes on elements. HTML
        attributes change the behavior of that element. There are many different
        kinds of elements. There are elements for different types of text,
        images, videos, and page layouts. Some of those elements have special
        attributes that change the way they behave. But for this lesson you will
        only need:
    </p>
    <List>
        <li>
            The <span class="font-mono">div</span> element, a generic container for
            many purposes.
        </li>
        <li>
            The <span class="font-mono">style</span> attribute, which changes the
            look of the element (soon we'll switch to doing this in CSS).
        </li>
        <li>
            The <span class="font-mono">class</span> attribute, which allows us to
            refer to manipulate and access an element from CSS and JavaScript. Think
            of the class attribute as a label that allows you to refer to it from
            other places.
        </li>
    </List>
    <hr class="mb-4 mt-4" />
    <div class="md:flex gap-10">
        <Question
            stateId="fundamentals-elem1-q1"
            class="mb-4"
            bind:this={questions[0]}
            options={[
                {
                    text: "div",
                    correct: false,
                    hint: "Are you sure you weren't looking at example 2?",
                },
                {
                    text: "p",
                    correct: true,
                    hint: "The tag name is what specifies the type of element.",
                },
                {
                    text: "class",
                    correct: false,
                    hint: "The element has a class attribute but this is not the type of element.",
                },
            ]}
            ><p>
                1. Which type of HTML element is shown in example 1?
            </p></Question
        >
        <div>
            <p>
                2. Add a <span class="font-mono">div</span> element to the HTML code
                window on the right. Give it a class attribute with the value "example".
            </p>
            <p>
                3. Open the
                <a
                    class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
                    target="_blank"
                    >official reference on HTML elements
                </a> and review a few of the sections. What questions come to mind?
                How might you go about answering them?
            </p>
        </div>
    </div>
</Step>
