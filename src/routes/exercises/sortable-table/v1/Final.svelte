<script lang="ts">
    import finalJavaScript from "./final.js?raw";
    import finalHTML from "./final.html?raw";
    import finalCSS from "./final.css?raw";
    import prependJavaScript from "./prepend.js?raw";
    import prependCSS from "./prepend.css?raw";
    let srcDoc = `
		<html lang="en">		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
                <style>${prependCSS}</style>
        <style>${finalCSS}</style>
        		<body>${finalHTML}</body>
        <script>${prependJavaScript}<\/script>
		<script>${finalJavaScript}<\/script>
		</html>`;
</script>

<iframe
    class="final-result border-solid border-1 border-gray-200 dark:border-gray-700 mt-2"
    srcdoc={srcDoc}
    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
    title="output"
></iframe>

<style>
    .final-result {
        width: 100%;
        height: 300px;
    }
</style>
