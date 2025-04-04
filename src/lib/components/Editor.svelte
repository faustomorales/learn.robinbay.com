<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import JsLogo from "virtual:icons/vscode-icons/file-type-js-official";
	import CssLogo from "virtual:icons/vscode-icons/file-type-style";
	import HtmlLogo from "virtual:icons/ic/baseline-code";
	import Hint from "./Hint.svelte";
	import { Tabs, TabItem } from "flowbite-svelte";
	import {
		createAnnotations,
		type CodeInput,
		type Tooltip,
		type ReadonlySettings,
	} from "$lib/codemirror.svelte";
	import { type PrependedCode, defaultPrependedCode } from "$lib/common";
	import { onMount, type Component } from "svelte";
	import { browser } from "$app/environment";
	import CodeMirror from "svelte-codemirror-editor";

	import { githubDark } from "@fsegurai/codemirror-theme-github-dark";
	import { githubLight } from "@fsegurai/codemirror-theme-github-light";
	import { javascript } from "@codemirror/lang-javascript";
	import { html } from "@codemirror/lang-html";
	import { css } from "@codemirror/lang-css";
	let {
		stateId = "",
		prepend = defaultPrependedCode,
		initial = defaultPrependedCode,
		iframe = $bindable(),
		iframeVisibility = "visible",
		tabs = ["html", "css", "js"],
		readonly = false,
		tooltips = [],
		inputs = $bindable([]),
		height = null,
		...props
	}: {
		stateId?: string;
		iframe?: HTMLIFrameElement;
		iframeVisibility?: "visible" | "hidden" | "disabled";
		prepend?: PrependedCode;
		initial?: PrependedCode;
		readonly?:
			| boolean
			| {
					js: ReadonlySettings;
					html: ReadonlySettings;
					css: ReadonlySettings;
			  };
		height?: number | null;
		tabs?: ("html" | "css" | "js")[];
		class?: ClassValue;
		tooltips?: Tooltip[];
		inputs?: CodeInput[];
	} = $props();
	let theme: typeof githubDark | typeof githubLight | undefined =
		$state(undefined);
	let uid = $props.id();

	onMount(() => {
		const listener = ({ matches: isDark }: { matches: boolean }) =>
			(theme = isDark ? githubDark : githubLight);
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		listener(mediaQuery);
		mediaQuery.addEventListener("change", listener);
		return () => {
			mediaQuery.removeEventListener("change", listener);
		};
	});
	let keys = {
		js: stateId ? `${stateId}:js` : null,
		css: stateId ? `${stateId}:css` : null,
		html: stateId ? `${stateId}:html` : null,
	};
	let components = $state({
		js:
			(browser && keys.js && localStorage.getItem(keys.js)) ||
			initial.js ||
			"",
		html:
			(browser && keys.html && localStorage.getItem(keys.html)) ||
			initial.html ||
			"",
		css:
			(browser && keys.css && localStorage.getItem(keys.css)) ||
			initial.css ||
			"",
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
			{ type: 'javascript-error', message, source, lineno, colno, error, uid: "${uid}" }, '*');
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
					source: string;
					message: string;
					uid: string;
				};
			}) => {
				if (
					message.data.type === "javascript-error" &&
					message.data.uid === uid
				) {
					javascriptError = `Error on line ${message.data.lineno - javascriptStart}. ${message.data.message}`;
					if (typeof iframe === "object") {
						iframe!.onload = () => (javascriptError = "");
					}
				}
			},
		);
	});
	$effect(() => {
		if (!keys.js || !keys.css || !keys.html) return;
		localStorage.setItem(keys.js, components.js || "");
		localStorage.setItem(keys.html, components.html || "");
		localStorage.setItem(keys.css, components.css || "");
	});
	let langs: {
		[key in "html" | "css" | "js"]: {
			logo: Component;
			long?: string;
			spec: typeof html | typeof css | typeof javascript;
		};
	} = {
		html: { logo: HtmlLogo, spec: html },
		css: { logo: CssLogo, spec: css },
		js: { logo: JsLogo, spec: javascript, long: "JavaScript" },
	};
</script>

<div style={`--editor-height: ${height}px;`} class={props.class}>
	{#if theme}
		<Tabs
			contentClass={`${readonly ? "readonly" : ""} bg-gray-50 dark:bg-gray-800 border-b-solid border-b-1 border-r-1 border-l-1 border-gray-200 dark:border-gray-700`}
			activeClasses={`${tabs.length > 1 ? "visible" : "hidden"} p-2 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500`}
			inactiveClasses="p-2 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
		>
			{#each tabs.map((tab) => ({ lang: langs[tab], tab })) as tab, i}
				<TabItem open={i === 0}>
					<div slot="title" class="heading flex items-center">
						<tab.lang.logo /><span class="p-1"
							>{tab.lang.long || tab.tab.toUpperCase()}</span
						>
					</div>
					<div class="pane">
						<CodeMirror
							bind:value={components[tab.tab]}
							{theme}
							lang={tab.lang.spec()}
							readonly={!!readonly}
							on:beforeChange={() => {
								console.log("Before change");
							}}
							extensions={createAnnotations(
								components[tab.tab],
								tooltips.filter((t) => t.language == tab.tab),
								inputs.filter((t) => t.language == tab.tab),
							)}
						/>
					</div>
					{#if tab.tab === "js" && javascriptError}
						<Hint
							hint={javascriptError}
							className="text-red-500 p-2 font-mono text-xs"
						/>
					{/if}
				</TabItem>
			{/each}
		</Tabs>
	{/if}
</div>

{#if iframeVisibility !== "disabled"}
	<iframe
		srcdoc={source}
		sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
		title="output"
		frameborder="0"
		bind:this={iframe}
		class={`border-solid border-1 border-gray-200 dark:border-gray-700 mt-2 ${iframeVisibility === "hidden" ? "hidden" : "visible"}`}
	></iframe>
{/if}

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
		height: var(--editor-height);
	}
	:global(.readonly .cm-scroller .cm-layer .cm-cursor.cm-cursor-primary) {
		visibility: hidden;
	}
	:global(.tooltip) {
		padding: 4px 8px;
		color: black;
		background-color: white;
		border: 1px black solid;
		box-shadow: 0 0 3px #ccc;
		max-width: 256px;
	}
	:global(.cm-placeholder) {
		background-color: rgba(255, 255, 0, 0.25);
	}
</style>
