<script lang="ts">
</script>

<div class="container">
    <div>
        <div class="labeled flex items-center mr-1 mb-3">
            {"<"}
            <div class="labeled mr-3">{"div"}</div>
            <div class="labeled">{"style"}</div>
            <div class="labeled no-border">{"="}</div>
            <div class="labeled mr-1">{'"color: green;"'}</div>
            {">"}
        </div>
        <br />
        <div class="labeled flex items-center mr-1 mb-3 ml-6">
            {"<"}
            <div class="labeled mr-3 ml-1">{"div"}</div>
            <div class="labeled">{"style"}</div>
            <div class="labeled no-border">{"="}</div>
            <div class="labeled mr-1">{'"color: green;"'}</div>
            {">"}
        </div>
        <br />
        <div class="labeled ml-6 mb-3">
            <div class="labeled no-border flex items-center">{"</div>"}</div>
        </div>
        <br />
        <div class="labeled">
            <div class="labeled no-border flex items-center">{"</div>"}</div>
        </div>
    </div>
</div>

<style>
    .labeled {
        font-family: monospace;
        font-size: 10px;
        padding: 5px;
        border: 1px solid #ccc;
        display: inline-flex;
    }

    .no-border {
        border: none;
    }
</style>
