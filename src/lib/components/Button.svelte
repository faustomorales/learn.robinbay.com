<script lang="ts">
    let {
        text,
        color = "blue",
        disabled = false,
        onclick,
    }: {
        text: string;
        color?: "blue" | "red";
        disabled?: boolean;
        onclick: (event: MouseEvent) => void;
    } = $props();
</script>

<button
    class={`disabled:bg-gray-600 disabled:dark:bg-gray-600 bg-${color}-500 hover:bg-${color}-700 text-white rounded py-2 px-4`}
    {onclick}
    {disabled}
>
    {text}
</button>
