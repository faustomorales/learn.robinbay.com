<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { Pane, Splitpanes } from "svelte-splitpanes";
	import CodeMirror from "svelte-codemirror-editor";
	import { javascript } from "@codemirror/lang-javascript";
	import { html } from "@codemirror/lang-html";
	import { css } from "@codemirror/lang-css";
	let {
		check,
		waitTime = 100,
	}: {
		check: (iframe: HTMLIFrameElement) => void;
		waitTime?: number;
	} = $props();
	let iframe: HTMLIFrameElement;
	let keys = {
		js: `${page.url.pathname}:js`,
		css: `${page.url.pathname}:css`,
		html: `${page.url.pathname}:html`,
	};
	let components = $state({
		js: (browser && localStorage.getItem(keys.js)) || "",
		html: (browser && localStorage.getItem(keys.html)) || "",
		css: (browser && localStorage.getItem(keys.css)) || "",
	});

	let source = $state("");
	onMount(() => {
		window.addEventListener("message", (message) => {
			if (message.data.type === "log") {
				console.log(...message.data.args);
			}
		});
	});

	const update = () => {
		localStorage.setItem(keys.js, components.js);
		localStorage.setItem(keys.html, components.html);
		localStorage.setItem(keys.css, components.css);
		source = `
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<script>
			const internal = console.log;
			const external = (...args) => {
				parent.window.postMessage({ type: 'log', args: args }, '*')
				internal(...args)
			}
			console.log = external;
		<\/script>
		<body>${components.html}</body>
		<style>${components.css}</style>
		<script>${components.js}<\/script>
		</html>`;

		setTimeout(() => check(iframe), waitTime);
	};
</script>

<Splitpanes class="default-theme">
	<Pane minSize={15}
		><CodeMirror bind:value={components.js} lang={javascript()} /></Pane
	>
	<Pane><CodeMirror bind:value={components.css} lang={css()} /></Pane>
	<Pane><CodeMirror bind:value={components.html} lang={html({})} /></Pane>
</Splitpanes>
<button onclick={update}>Update</button>

<iframe
	srcdoc={source}
	onerror={(e) => {
		console.log(e);
	}}
	sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
	title="output"
	frameborder="0"
	bind:this={iframe}
></iframe>

<style>
	iframe {
		width: 100%;
		height: 100%;
	}
</style>
