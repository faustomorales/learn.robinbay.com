<script lang="ts">
    import Cards from "$lib/components/Cards.svelte";
    let sections = [
        {
            title: "Lessons",
            description:
                "In the following lessons, we'll cover the basics of programming using JavaScript. In each lesson, we'll learn a concept in the context of controlling a Sphero robot. Don't have a Sphero robot? No problem! You can still follow along by using the built-in simulator.",
            subsections: [
                {
                    title: "Variables",
                    description:
                        "Variables are how we store information in programming. In these lessons, we'll learn how to store different types of information.",
                    cards: [
                        {
                            link: "/lessons/javascript/variables/strings",
                            title: "A Colorful Introduction",
                            subtitle: "Lesson 1: Strings",
                            icon: "📝",
                            description:
                                "In programming, we store information using <b>variables</b>. In this lesson, we'll learn to store text in a <b>string</b> variable to set the color of the Sphero robot.",
                        },
                        {
                            link: "/lessons/javascript/variables/numbers",
                            title: "Blink Twice If You're A Robot",
                            subtitle: "Lesson 2: Numbers",
                            icon: "🔢",
                            description:
                                "Variables can also be numbers. In this lesson, we'll learn to store numbers in a <b>number</b> variable to control the blinking of the Sphero robot.",
                        },
                        {
                            link: "/lessons/javascript/variables/arrays",
                            subtitle: "Lesson 3: Arrays",
                            title: "Robots Love Rainbows",
                            icon: "📂",
                            description:
                                "Sometimes, we want a single variable to store a series of values. In this lesson, we'll learn to store multiple values in an <b>array</b> variable to control the series of colors we want the Sphero to emit.",
                        },
                        {
                            subtitle: "Lesson 4: Objects",
                            link: "/lessons/javascript/variables/objects",
                            title: "Don't Use Two If One Will Do",
                            icon: "🗂️",
                            description:
                                "We often have related but disparate data that we want to store together. In this lesson, we'll store both color and the delay in blinking in a single <b>object</b> variable.",
                        },
                        {
                            subtitle: "Lesson 5: Arrays of Objects",
                            link: "/lessons/javascript/variables/arrays-of-objects",
                            title: "Color in Motion",
                            icon: "🌈",
                            description:
                                "In this final lesson on variables, we will see how all of these data types combine together by defining a series of actions that we want the ball to take.",
                        },
                    ],
                },
            ],
        },
        {
            title: "Projects",
            description: "Build projects that combine skills together.",
            cards: [
                {
                    link: "/projects/fundamentals",
                    title: "Fundamentals",
                    icon: "💻",
                    description:
                        "Build a web app that teaches the fundamentals of JavaScript, HTML, and CSS.",
                },
                {
                    link: "/projects/food-pantry-locator",
                    title: "Food Pantry Locator",
                    icon: "🥫",
                    description:
                        "Build a web app that helps people find food pantries near them.",
                },
            ],
        },
        {
            title: "Playgrounds",
            description: "Practice your skills in an open-ended environment.",
            cards: [
                {
                    link: "/sphero",
                    icon: "🤖",
                    title: "Sphero Robot Control",
                    description: "Control a Sphero robot using JavaScript.",
                },
            ],
        },
    ];
</script>

<svelte:head>
    <title>Learn to Code</title>
</svelte:head>

<div class="container mx-auto p-6 space-y-8">
    {#each sections as section, sectionIndex}
        {#if sectionIndex > 0}
            <hr class="border-gray-200" />
        {/if}
        <div class="space-y-4">
            <h2 class="text-2xl font-bold">{section.title}</h2>
            <p class="text-gray-600 dark:text-gray-100">
                {section.description}
            </p>
            {#if section.cards}
                <Cards cards={section.cards} />
            {:else}
                {#each section.subsections as subsection}
                    <h3 class="text-xl font-bold">{subsection.title}</h3>
                    <p class="text-gray-600 dark:text-gray-100">
                        {subsection.description}
                    </p>
                    <Cards cards={subsection.cards} />
                {/each}
            {/if}
        </div>
    {/each}
</div>
