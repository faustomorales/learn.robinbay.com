<script lang="ts">
	import JsLogo from "virtual:icons/vscode-icons/file-type-js-official";
	import CssLogo from "virtual:icons/vscode-icons/file-type-style";
	import HtmlLogo from "virtual:icons/ic/baseline-code";
	import { Tabs, TabItem } from "flowbite-svelte";
	import { type PrependedCode, defaultPrependedCode } from "$lib/common";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import CodeMirror from "svelte-codemirror-editor";
	import { oneDark } from "@codemirror/theme-one-dark";
	import { javascript } from "@codemirror/lang-javascript";
	import { html } from "@codemirror/lang-html";
	import { css } from "@codemirror/lang-css";
	let {
		stateId,
		prepend = defaultPrependedCode,
		initial = defaultPrependedCode,
		iframe = $bindable(),
		tabs = { html: true, css: true, js: true },
		hideIframe = false,
	}: {
		stateId: string;
		iframe?: HTMLIFrameElement;
		prepend?: PrependedCode;
		initial?: PrependedCode;
		tabs?: { html?: boolean; css?: boolean; js?: boolean };
		hideIframe?: boolean;
	} = $props();
	let isDarkMode = $state(false);
	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		isDarkMode = mediaQuery.matches;

		const listener = (event: any) => {
			isDarkMode = event.matches;
		};

		mediaQuery.addEventListener("change", listener);

		return () => {
			mediaQuery.removeEventListener("change", listener);
		};
	});
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
	let theme = $derived(isDarkMode ? oneDark : undefined);
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
</script>

<div>
	<Tabs
		contentClass={"bg-gray-50 dark:bg-gray-800 border-b-solid border-b-1 border-r-1 border-l-1 border-gray-200 dark:border-gray-700"}
	>
		{#if tabs.html}
			<TabItem open>
				<div slot="title" class="heading flex items-center">
					<HtmlLogo /><span class="p-1">HTML</span>
				</div>
				<div class="pane">
					<CodeMirror
						bind:value={components.html}
						{theme}
						lang={html({})}
					/>
				</div>
			</TabItem>
		{/if}
		{#if tabs.css}
			<TabItem open={!tabs.html}>
				<div slot="title" class="heading flex items-center">
					<CssLogo /><span class="p-1">CSS</span>
				</div>
				<div class="pane">
					<CodeMirror
						bind:value={components.css}
						lang={css()}
						{theme}
					/>
				</div>
			</TabItem>
		{/if}
		{#if tabs.js}
			<TabItem open={!tabs.html && !tabs.css}>
				<div slot="title" class="heading flex items-center">
					<JsLogo /><span class="p-1">JavaScript</span>
				</div>
				<div class="pane">
					<CodeMirror
						bind:value={components.js}
						lang={javascript()}
						{theme}
					/>
				</div>
			</TabItem>
		{/if}
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
	bind:this={iframe}
	class={`border-solid border-1 border-gray-200 dark:border-gray-700 mt-2 ${hideIframe ? "hidden" : ""}`}
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
	.pane {
		height: 320px;
	}
</style>
