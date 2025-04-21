import { parseInteractiveSnippet } from "./codemirror.svelte";

import { test, expect } from "vitest";

test("basic input", () => {
  let parsed = parseInteractiveSnippet(
    `[[ "id": "div-open", "text": "this is the html tag"]]<div>[[ "id": "div-open" ]]{{ "id": "test-state" }}</div>`,
    "html",
  );
  expect(parsed.inputs).toHaveProperty("test-state");
  expect(parsed.tooltips).toHaveLength(1);
  expect(parsed.formatted).toBe("<div>          </div>\n");
});
