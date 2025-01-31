<script lang="ts">
    import Step from "$lib/components/Step.svelte";
    import Question from "$lib/components/Question.svelte";
    import AnatomyDiagram from "$lib/drawings/html-element.svg?raw";
    import Link from "$lib/components/Link.svelte";
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
        Example 1 is of a single HTML <span class="font-mono">p</span> element, which
        is normally (as in this example) used to contain a paragraph of text.
    </p>
    <p class="mb-4">
        HTML elements can be nested within each other, creating child and parent
        relationships. In example 2, we have a
        <Link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p"
            ><span class="font-mono">p</span></Link
        >
        element nested within a
        <Link
            href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div"
            ><span class="font-mono">div</span></Link
        > element. You could also refer to the child element as the content of the
        parent element. You might do this to group text content with other content.
        Note that elements are allowed to be empty (i.e., for the closing tag to
        come immediately after the opening tag).
    </p>
    <div class="flex justify-around mt-2">
        {@html AnatomyDiagramNested}
    </div>
    <div class="text-xs text-gray-800 text-center">
        Example 2: Nested HTML Element
    </div>
    <p class="mt-4 mb-4">
        Both example 1 and example 2 show how we set element <span
            class="font-mono">attributes</span
        >. HTML attributes change the behavior of that element and different
        elements support different combinations of attributes (<span
            class="font-mono">class</span
        >
        and <span class="font-mono">style</span> are examples of
        <Link
            href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes"
            >global attributes</Link
        >
        supported by all element types). For example, the
        <Link
            href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video"
            ><span class="font-mono">video</span></Link
        >
        element has an optional <span class="font-mono">autoplay</span> attribute
        that indicates whether the video should immediately play. Some of those elements
        have special attributes that change the way they behave. But for this lesson
        you will only need:
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
                <Link
                    href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
                    >official reference on HTML elements
                </Link> and review a few of the sections. What questions come to
                mind? How might you go about answering them?
            </p>
        </div>
    </div>
</Step>
