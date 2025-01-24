<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";

    let check = (iframe: HTMLIFrameElement) => {
        console.log("Mark 0.");
            let table = iframe.contentDocument?.querySelector(".my-table");
            if (!table) {
                console.log("I did not find a table with class 'my-table'");
            } else {
                console.log("Great work!")
            }
    };
</script>

<p>Please create a table element with class "my-table".</p>

<Editor {check} />
