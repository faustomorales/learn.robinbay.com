<script lang="ts">
    let sections = [
        {
            title: "Lessons",
            description: "Learn JavaScript from scratch.",
            cards: [
                {
                    link: "/lessons/javascript/variables/strings",
                    title: "Variables: Strings",
                    icon: "📝",
                    description:
                        "Variables are used to store information. In this lesson, you will learn how to store text in a variable.",
                },
                {
                    link: "/lessons/javascript/variables/numbers",
                    title: "Variables: Numbers",
                    icon: "🔢",
                    description: "Learn how to store numbers in a variable.",
                },
                {
                    link: "/lessons/javascript/variables/arrays",
                    title: "Variables: Arrays",
                    icon: "📂",
                    description:
                        "Learn how to store a series of values in a variable.",
                },
                {
                    link: "/lessons/javascript/variables/objects",
                    title: "Variables: Objects",
                    icon: "🗂️",
                    description:
                        "Learn how to store key-value pairs in a variable.",
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
    {#each sections as section}
        <div class="space-y-4">
            <h2 class="text-2xl font-bold">{section.title}</h2>
            <p class="text-gray-600">{section.description}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {#each section.cards as card}
                    <div
                        class="p-3 bg-white rounded-xl shadow-lg border-1 border-solid border-gray-200 flex flex-col items-center space-y-4"
                    >
                        <div
                            class="flex items-center space-x-2 text-lg font-bold"
                        >
                            <span>{card.icon}</span>
                            <a
                                class="hover:underline underline-thick-2"
                                target="_blank"
                                href={card.link}
                            >
                                <h3 class="leading-normal">{card.title}</h3>
                            </a>
                        </div>
                        <p class="text-gray-500">
                            {card.description}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .underline-thick-2 {
        text-decoration-thickness: 2px;
    }
</style>
