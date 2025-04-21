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
  } from "$lib/codemirror.svelte";
  import { type PrependedCode, defaultPrependedCode } from "$lib/common";
  import { onMount, type Component } from "svelte";
  import { getKeyValue, setKeyValue } from "$lib/common";
  import CodeMirror from "svelte-codemirror-editor";

  import { githubDark } from "@fsegurai/codemirror-theme-github-dark";
  import { githubLight } from "@fsegurai/codemirror-theme-github-light";
  import { javascript } from "@codemirror/lang-javascript";
  import { html } from "@codemirror/lang-html";
  import { css } from "@codemirror/lang-css";
  import Button from "./Button.svelte";
  let {
    stateId = "",
    prepend = defaultPrependedCode,
    base = defaultPrependedCode,
    iframe = $bindable(),
    iframeVisibility = "visible",
    showConsole = false,
    onIframeLoad = () => {},
    tabs = ["html", "css", "js"],
    readonly = false,
    tooltips = [],
    inputs = $bindable({}),
    ...props
  }: {
    stateId?: string;
    showConsole?: boolean;
    onIframeLoad?: (iframe: HTMLIFrameElement) => void;
    iframe?: HTMLIFrameElement;
    iframeVisibility?: "visible" | "hidden" | "disabled";
    prepend?: PrependedCode;
    base?: PrependedCode;
    readonly?: boolean;
    tabs?: ("html" | "css" | "js")[];
    class?: ClassValue;
    tooltips?: Tooltip[];
    inputs?: { [key: string]: CodeInput };
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
  const languageSettings: {
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
  let components = $state(
    tabs
      .map((t) => ({ key: stateId ? `${stateId}:${t}` : null, language: t }))
      .map((t) => ({
        ...t,
        content: getKeyValue(t.key, base[t.language]),
        settings: languageSettings[t.language],
        tooltips: tooltips.filter((tip) => t.language == tip.language),
        inputs: Object.values(inputs).filter((i) => i.language === t.language),
      }))
      .map((tab) => ({
        ...tab,
        ...createAnnotations(
          tab.content,
          tab.tooltips,
          tab.inputs,
          base[tab.language],
        ),
      })),
  );
  $effect(() => components.forEach((c) => setKeyValue(c.key, c.content)));
  let keyedComponents = $derived(
    components.reduce((a, v) => ({ ...a, [v.language]: v.content }), {}) as {
      js: string;
      css: string;
      html: string;
    },
  );
  const reset = () => {
    Object.keys(inputs).map((k) =>
      setKeyValue(inputs[k].stateId, inputs[k].default),
    );
    components = components.map((tab) => {
      return {
        ...tab,
        ...createAnnotations(
          base[tab.language] || "",
          tab.tooltips,
          Object.values(inputs).filter(
            (input) => input.language === tab.language,
          ),
          base[tab.language],
        ),
      };
    });
  };
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
      var originalConsoleLog = console.log;
      window.console.log = (...args) => {
        originalConsoleLog(...args);
        parent.window.postMessage(
          { type: 'console-log', args, uid: "${uid}" });
    };
		<\/script>
		<body>
			${prepend.html}
			${keyedComponents.html || ""}
		</body>
		<style onerror="parent.window.postMessage({ type: 'error', message: 'CSS Error' }, '*')">
			${prepend.css}
			${keyedComponents.css}
		</style>
		<script>
			"use strict";
			${prepend.js}
			"start-marker";
			${keyedComponents.js}
			"end-marker";
		<\/script>
		</html>`);
  let javascriptStart = $derived(
    source.slice(0, source.indexOf(`"start-marker";`)).split("\n").length,
  );
  let javascriptError = $state("");
  let javascriptConsole = $state("");
  onMount(() => {
    window.addEventListener(
      "message",
      (message: {
        data:
          | {
              type: "javascript-error";
              lineno: number;
              source: string;
              message: string;
              uid: string;
            }
          | { type: "console-log"; args: any[]; uid: string };
      }) => {
        if (message.data.uid !== uid) return;

        if (message.data.type === "javascript-error") {
          javascriptError = `Error on line ${message.data.lineno - javascriptStart}. ${message.data.message}`;
          if (typeof iframe === "object") {
            let clearError = () => {
              javascriptError = "";
              iframe!.removeEventListener("load", clearError);
            };
            iframe!.addEventListener("load", clearError);
          }
        } else if (message.data.type === "console-log") {
          javascriptConsole +=
            message.data.args
              .map((arg: any) => {
                if (typeof arg === "object") {
                  return JSON.stringify(arg);
                }
                return arg;
              })
              .join(" ") + "\n";
        }
      },
    );
  });
</script>

{#if iframeVisibility !== "disabled"}
  <iframe
    srcdoc={source}
    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
    title="output"
    frameborder="0"
    bind:this={iframe}
    onload={() => {
      javascriptConsole = "";
      onIframeLoad(iframe!);
    }}
    class={`border-solid border-1 border-gray-200 dark:border-gray-700 mb-2 ${iframeVisibility === "hidden" ? "hidden" : "visible"}`}
  ></iframe>
{/if}

<div class={props.class}>
  {#if theme}
    <Tabs
      contentClass={`${readonly ? "readonly" : ""} bg-gray-50 dark:bg-gray-800 border-b-solid border-b-1 border-r-1 border-l-1 border-gray-200 dark:border-gray-700`}
      activeClasses={`${tabs.length > 1 ? "visible" : "hidden"} p-2 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500`}
      inactiveClasses="p-2 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    >
      {#each components as component, i}
        <TabItem open={i === 0}>
          <div slot="title" class="heading flex items-center">
            <component.settings.logo /><span class="p-1"
              >{component.settings.long ||
                component.language.toUpperCase()}</span
            >
          </div>
          <div class="pane">
            <CodeMirror
              bind:value={component.content}
              {theme}
              lang={component.settings.spec()}
              readonly={!!readonly}
              on:ready={(event) => {
                component.onReady(event.detail);
              }}
              extensions={component.extensions}
            />
          </div>
          {#if component.language === "js" && javascriptError}
            <Hint
              hint={javascriptError}
              className="text-red-500 p-2 font-mono text-xs"
            />
          {/if}
        </TabItem>
      {/each}
    </Tabs>
  {/if}
  {#if showConsole}
    <div class="space-y-2 mb-2 mt-2">
      <h2
        class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
      >
        Console Output
      </h2>
      <div
        class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-words shadow-md"
      >
        {#if javascriptConsole}
          {javascriptConsole}
        {:else}
          <span class="text-gray-400">No console output detected yet.</span>
        {/if}
      </div>
    </div>
  {/if}
  {#if Object.keys(inputs).length > 0}
    <div class="mt-2">
      <Button
        confirm="Are you sure you want to clear all of your work?"
        onclick={reset}
        text="Reset"
        color="red"
      />
    </div>
  {/if}
</div>

<style>
  iframe {
    width: 100%;
    height: var(--iframe-height, 240px);
  }
  :global(.cm-editor),
  :global(.codemirror-wrapper) {
    height: 100%;
  }
  .pane {
    height: var(--editor-height, 240px);
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
