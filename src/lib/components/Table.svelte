<script lang="ts">
    let {
        meta,
        data,
    }: { meta: { key: string; heading?: string }[]; data: any[] } = $props();
</script>

<table
    class="table-auto text-left table-auto font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
>
    <thead>
        <tr>
            {#each meta as def}
                <th class="p-2 border-b border-blue-gray-100 bg-blue-gray-50"
                    >{def.heading || def.key}</th
                >
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as row}
            <tr>
                {#each meta as def}
                    <td class="p-2">{@html row[def.key]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
