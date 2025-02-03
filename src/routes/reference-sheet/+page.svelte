<script lang="ts">

    import HTMLDiagram from "$lib/drawings/html-element.svg?raw";
    import HTMLNestedDiagram from "$lib/drawings/html-element-nested.svg?raw";
    import CSSDiagram from "$lib/drawings/css-rule.svg?raw";
    import JSNumber from "$lib/drawings/javascript-variable-number.svg?raw";
    import JSString from "$lib/drawings/javascript-variable-string.svg?raw";
    import JSObject from "$lib/drawings/javascript-variable-object.svg?raw";
    import JSFunction1 from "$lib/drawings/javascript-variable-function-1.svg?raw";
    import JSFunction2 from "$lib/drawings/javascript-variable-function-2.svg?raw";
    import JSArray from "$lib/drawings/javascript-variable-array.svg?raw";
    let heading = `mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 text-lg dark:text-white`;
    let headingSize = "w-1/3 pr-4";
    let itemClass = "flex p-2";
</script>

<svelte:head>
    <title>HTML, CSS, and JavaScript Reference Sheet</title>
</svelte:head>

<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>HTML Element</h2></div>
    <div>{@html HTMLDiagram}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>Nested HTML Element</h2></div>
    <div>{@html HTMLNestedDiagram}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>CSS Rule</h2></div>
    <div>{@html CSSDiagram}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>JavaScript Number</h2></div>
    <div>{@html JSNumber}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>JavaScript String</h2></div>
    <div>{@html JSString}</div>
</div>

<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>JavaScript Object</h2></div>
    <div>{@html JSObject}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>JavaScript Array</h2></div>
    <div>{@html JSArray}</div>
</div>
<div class={itemClass}>
    <div class={headingSize}><h2 class={heading}>JavaScript Function</h2></div>
    <div>{@html JSFunction1}<div>{@html JSFunction2}</div></div>
</div>

