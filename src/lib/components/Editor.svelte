<script lang="ts">
	import JsLogo from "virtual:icons/vscode-icons/file-type-js-official";
	import CssLogo from "virtual:icons/vscode-icons/file-type-style";
	import HtmlLogo from "virtual:icons/ic/baseline-code";
	import { Tabs, TabItem } from "flowbite-svelte";
	import { type PrependedCode, defaultPrependedCode } from "$lib/common";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import CodeMirror from "svelte-codemirror-editor";
	import { javascript } from "@codemirror/lang-javascript";
	import { html } from "@codemirror/lang-html";
	import { css } from "@codemirror/lang-css";
	let iframe: HTMLIFrameElement;
	let {
		stateId,
		check,
		prepend = defaultPrependedCode,
		initial = defaultPrependedCode,
	}: {
		stateId: string;
		iframe?: HTMLIFrameElement;
		prepend?: PrependedCode;
		initial?: PrependedCode;
		check: (iframe: HTMLIFrameElement, initial?: boolean) => void;
	} = $props();
	let keys = {
		js: `${stateId}:js`,
		css: `${stateId}:css`,
		html: `${stateId}:html`,
	};
	let components = $state({
		js: (browser && localStorage.getItem(keys.js)) || initial.js,
		html: (browser && localStorage.getItem(keys.html)) || initial.html,
		css: (browser && localStorage.getItem(keys.css)) || initial.css,
	});

	let source = $derived(`
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<script>
			const internal = console.log;
			/* const external = (...args) => {
				parent.window.postMessage({ type: 'log', args: args }, '*')
				internal(...args)
			}
			console.log = external; */
		<\/script>
		<body>
			${prepend.html}
			${components.html}
		</body>
		<style>
			${prepend.css}
			${components.css}
		</style>
		<script>
			${prepend.js}
			${components.js}
		<\/script>
		</html>`);
	let messages: MessageEvent[] = $state([]);
	onMount(() => {
		window.addEventListener("message", (message) => {
			if (message.data.type === "log") {
				messages.push(message);
			}
		});
	});
	$effect(() => {
		localStorage.setItem(keys.js, components.js);
		localStorage.setItem(keys.html, components.html);
		localStorage.setItem(keys.css, components.css);
	});

	export const update = () => {
		check(iframe, false);
	};
</script>

<div>
	<Tabs>
		<TabItem open>
			<div slot="title" class="heading flex items-center">
				<HtmlLogo /><span class="p-1">HTML</span>
			</div>
			<div class="pane">
				<CodeMirror bind:value={components.html} lang={html({})} />
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="heading flex items-center">
				<CssLogo /><span class="p-1">CSS</span>
			</div>
			<div class="pane">
				<CodeMirror bind:value={components.css} lang={css()} />
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="heading flex items-center">
				<JsLogo /><span class="p-1">JavaScript</span>
			</div>
			<div class="pane">
				<CodeMirror bind:value={components.js} lang={javascript()} />
			</div>
		</TabItem>
	</Tabs>
</div>

<iframe
	srcdoc={source}
	onerror={(e) => {
		console.log(e);
	}}
	sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
	title="output"
	frameborder="0"
	class="mt-2"
	bind:this={iframe}
></iframe>

<style>
	iframe {
		width: 100%;
		height: 480px;
	}

	:global(.cm-editor),
	:global(.codemirror-wrapper) {
		height: 100%;
	}
	iframe {
		border: 1px solid black;
	}
	.pane {
		height: 320px;
	}
</style>
