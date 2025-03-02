<script lang="ts">
	import JsLogo from "virtual:icons/vscode-icons/file-type-js-official";
	import CssLogo from "virtual:icons/vscode-icons/file-type-style";
	import HtmlLogo from "virtual:icons/ic/baseline-code";
	import Hint from "./Hint.svelte";
	import { Tabs, TabItem } from "flowbite-svelte";
	import { type PrependedCode, defaultPrependedCode } from "$lib/common";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import CodeMirror from "svelte-codemirror-editor";
	import { githubDark } from "@fsegurai/codemirror-theme-github-dark";
	import { githubLight } from "@fsegurai/codemirror-theme-github-light";
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
		disabled = false,
	}: {
		stateId: string;
		iframe?: HTMLIFrameElement;
		prepend?: PrependedCode;
		initial?: PrependedCode;
		disabled?: boolean;
		tabs?: { html?: boolean; css?: boolean; js?: boolean };
		hideIframe?: boolean;
	} = $props();
	let theme: typeof githubDark | typeof githubLight | undefined =
		$state(undefined);
	onMount(() => {
		const listener = ({ matches: isDark }: { matches: boolean }) => {
			console.log("isDark", isDark);
			theme = isDark ? githubDark : githubLight;
		};
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		listener(mediaQuery);
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
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<script>
			window.onerror = (message, source, lineno, colno, error) => parent.window.postMessage(
			{ type: 'javascript-error', message, source, lineno, colno, error }, '*');
		<\/script>
		<body>
			${prepend.html}
			${components.html}
		</body>
		<style onerror="parent.window.postMessage({ type: 'error', message: 'CSS Error' }, '*')">
			${prepend.css}
			${components.css}
		</style>
		<script>
			"use strict";
			${prepend.js}
			"start-marker";
			${components.js}
			"end-marker";
		<\/script>
		</html>`);
	let javascriptStart = $derived(
		source.slice(0, source.indexOf(`"start-marker";`)).split("\n").length,
	);
	let javascriptError = $state("");
	onMount(() => {
		window.addEventListener(
			"message",
			(message: {
				data: {
					type: "javascript-error";
					lineno: number;
					message: string;
				};
			}) => {
				if (message.data.type === "javascript-error") {
					javascriptError = `Error on line ${message.data.lineno - javascriptStart}. ${message.data.message}`;
					iframe!.onload = () => (javascriptError = "");
				}
			},
		);
	});
	$effect(() => {
		localStorage.setItem(keys.js, components.js);
		localStorage.setItem(keys.html, components.html);
		localStorage.setItem(keys.css, components.css);
	});
</script>

<div>
	{#if theme}
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
							readonly={disabled}
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
							readonly={disabled}
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
							readonly={disabled}
							bind:value={components.js}
							lang={javascript()}
							{theme}
						/>
					</div>
					{#if javascriptError}
						<Hint
							hint={javascriptError}
							className="text-red-500 p-2 font-mono text-xs"
						></Hint>
					{/if}
				</TabItem>
			{/if}
		</Tabs>
	{/if}
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
