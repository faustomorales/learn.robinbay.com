<script lang="ts">
    let {
        cards,
    }: {
        cards: {
            title: string;
            description: string;
            subtitle?: string;
            icon: string;
            link: string;
        }[];
    } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each cards as card}
        <div
            class="border-1 border-solid border-gray-200 rounded-xl shadow-lg bg-white dark:bg-gray-800"
        >
            {#if card.subtitle}
                <div
                    class="p-2 border-b-1 border-solid border-gray-200 text-xs text-gray-500 dark:text-gray-200"
                >
                    {card.subtitle}
                </div>
            {/if}
            <div class="p-3 flex flex-col space-y-4">
                <div class="flex items-center space-x-2 text-lg font-bold">
                    <span>{card.icon}</span>
                    <a
                        class="hover:underline underline-thick-2"
                        target="_blank"
                        href={card.link}
                    >
                        <h3 class="leading-normal">{card.title}</h3>
                    </a>
                </div>
                <p class="text-gray-500 dark:text-gray-200">
                    {@html card.description}
                </p>
            </div>
        </div>
    {/each}
</div>

<style>
    .underline-thick-2 {
        text-decoration-thickness: 2px;
    }
</style>
