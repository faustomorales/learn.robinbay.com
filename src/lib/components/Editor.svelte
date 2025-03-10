<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import JsLogo from "virtual:icons/vscode-icons/file-type-js-official";
	import CssLogo from "virtual:icons/vscode-icons/file-type-style";
	import HtmlLogo from "virtual:icons/ic/baseline-code";
	import Hint from "./Hint.svelte";
	import { Tabs, TabItem } from "flowbite-svelte";
	import {
		type PrependedCode,
		type Tooltip,
		defaultPrependedCode,
	} from "$lib/common";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import CodeMirror from "svelte-codemirror-editor";
	import {
		hoverTooltip,
		Decoration,
		type DecorationSet,
		EditorView,
		ViewPlugin,
	} from "@codemirror/view";
	import { RangeSet } from "@codemirror/state";

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
		disableIframe = false,
		tabs = { html: true, css: true, js: true },
		hideTabs = false,
		hideIframe = false,
		readonly = false,
		tooltips = {},
		height = null,
		...props
	}: {
		stateId?: string;
		iframe?: HTMLIFrameElement;
		prepend?: PrependedCode;
		initial?: PrependedCode;
		readonly?: boolean;
		hideTabs?: boolean;
		disableIframe?: boolean;
		height?: number | null;
		tabs?: { html?: boolean; css?: boolean; js?: boolean };
		hideIframe?: boolean;
		class?: ClassValue;
		tooltips?: { html?: Tooltip[]; css?: Tooltip[]; js?: Tooltip[] };
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

	const createTooltips = (tips: Tooltip[]) => {
		return [
			hoverTooltip((view, pos, side) => {
				let matching = tips.find(
					({ from, to }) => pos >= from && pos <= to,
				);
				if (!matching) return null;
				return {
					pos: matching.from,
					end: matching.to,
					above: true,
					create(view) {
						let dom = document.createElement("div");
						dom.className = "tooltip";
						dom.innerHTML = matching.text;
						return { dom };
					},
				};
			}),
			ViewPlugin.fromClass(
				class {
					marks: DecorationSet;
					constructor(view: EditorView) {
						this.marks = RangeSet.of(
							tips.map(({ from, to }) =>
								Decoration.mark({
									inclusive: true,
									inclusiveStart: true,
									inclusiveEnd: true,
									class: "cm-placeholder",
								}).range(from, to),
							),
						);
					}
				},
				{
					decorations: (instance) => instance.marks,
					provide: (plugin) =>
						EditorView.atomicRanges.of(
							(view) =>
								view.plugin(plugin)?.marks || Decoration.none,
						),
				},
			),
		];
	};
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
					iframe!.onload = () => (javascriptError = "");
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
</script>

<div style={`--editor-height: ${height}px;`} class={props.class}>
	{#if theme}
		<Tabs
			contentClass={`${readonly ? "readonly" : ""} bg-gray-50 dark:bg-gray-800 border-b-solid border-b-1 border-r-1 border-l-1 border-gray-200 dark:border-gray-700`}
			activeClasses={`${hideTabs ? "hidden" : ""} p-2 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500`}
			inactiveClasses="p-2 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
		>
			{#if tabs.html}
				<TabItem open>
					<div slot="title" class="heading flex items-center">
						<HtmlLogo /><span class="p-1">HTML</span>
					</div>
					<div class="pane">
						<CodeMirror
							bind:value={components.html}
							{readonly}
							{theme}
							lang={html({})}
							extensions={[
								...createTooltips(tooltips.html || []),
							]}
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
							{readonly}
							bind:value={components.css}
							lang={css()}
							{theme}
							extensions={[...createTooltips(tooltips.css || [])]}
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
							{readonly}
							bind:value={components.js}
							lang={javascript()}
							{theme}
							extensions={[...createTooltips(tooltips.js || [])]}
						/>
					</div>
					{#if javascriptError}
						<Hint
							hint={javascriptError}
							className="text-red-500 p-2 font-mono text-xs"
						/>
					{/if}
				</TabItem>
			{/if}
		</Tabs>
	{/if}
</div>

{#if !disableIframe}
	<iframe
		srcdoc={source}
		onerror={(e) => {
			console.log("Error Mark 1", e);
		}}
		sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
		title="output"
		frameborder="0"
		bind:this={iframe}
		class={`border-solid border-1 border-gray-200 dark:border-gray-700 mt-2 ${hideIframe ? "hidden" : ""}`}
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
