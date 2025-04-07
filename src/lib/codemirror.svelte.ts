import {
  EditorView,
  WidgetType,
  Decoration,
  ViewPlugin,
  hoverTooltip,
} from "@codemirror/view";
import { EditorState, Transaction } from "@codemirror/state";
import { RangeSet } from "@codemirror/state";

export type Language = "html" | "css" | "js";
export type CodeInput = {
  key: string;
  value: string;
  options?: string[];
  language: Language;
  line: number;
  width: number;
  positions: {
    pos: number;
    id: string;
  }[];
};
export type Tooltip = {
  language: Language;
  from: { line: number; character?: number };
  to: { line: number; character?: number };
  text: string;
};
type NormalizedItem = {
  from: number;
  to: number;
  width: number;
  height: number;
};

type NormalizedCodeInput = CodeInput & { normalized: NormalizedItem[] };

export const preventModifyTargetRanges = (
  getReadOnlyRanges: (
    targetState: EditorState,
  ) => Array<{ from: number | undefined; to: number | undefined }>,
) =>
  EditorState.changeFilter.of((tr: Transaction) => {
    try {
      const readOnlyRangesBeforeTransaction = getReadOnlyRanges(tr.startState);
      const readOnlyRangesAfterTransaction = getReadOnlyRanges(tr.state);

      for (let i = 0; i < readOnlyRangesBeforeTransaction.length; i++) {
        const targetFromBeforeTransaction =
          readOnlyRangesBeforeTransaction[i].from ?? 0;
        const targetToBeforeTransaction =
          readOnlyRangesBeforeTransaction[i].to ??
          tr.startState.doc.line(tr.startState.doc.lines).to;

        const targetFromAfterTransaction =
          readOnlyRangesAfterTransaction[i].from ?? 0;
        const targetToAfterTransaction =
          readOnlyRangesAfterTransaction[i].to ??
          tr.state.doc.line(tr.state.doc.lines).to;

        if (
          tr.startState.sliceDoc(
            targetFromBeforeTransaction,
            targetToBeforeTransaction,
          ) !==
          tr.state.sliceDoc(
            targetFromAfterTransaction,
            targetToAfterTransaction,
          )
        ) {
          return false;
        }
      }
    } catch (e) {
      return false;
    }
    return true;
  });

const createInputElement = (params: NormalizedCodeInput) => {
  let input = document.createElement(params.options ? "select" : "input");
  input.classList.add(
    ...[
      "bg-transparent",
      "placeholder:text-slate-400",
      "text-slate-700",
      "dark:text-slate-100",
      "text-xs",
      "border",
      "border-slate-200",
      "rounded-md",
      "text-center",
      "p-1",
      "transition",
      "duration-300",
      "ease",
      "focus:outline-none",
      "focus:border-slate-400",
      "hover:border-slate-300",
      "shadow-sm",
      "focus:shadow",
    ],
  );
  input.contentEditable = "true";
  // Loop through the options array and create an option element for each value
  if (params.options) {
    params.options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;

      // If this option matches the selected value, mark it as selected
      if (optionText === params.value) {
        option.selected = true;
      }

      // Append the option to the select element
      input.appendChild(option);
    });
  } else {
    input.size = params.width;
    (input as HTMLInputElement).maxLength = params.width;
  }
  input.value = params.value;
  return input;
};

class InputWidget extends WidgetType {
  input: HTMLSelectElement | HTMLInputElement;
  id: string;

  constructor(input: HTMLInputElement | HTMLSelectElement, id: string) {
    super();
    this.input = input;
    this.id = id;
  }

  eq(other: InputWidget) {
    return other.id === this.id;
  }

  updateDOM(dom: HTMLElement, view: EditorView): boolean {
    return true;
  }

  toDOM = () => this.input;
}

const linePositionToNormalized = (
  lineStartIndexes: number[],
  from: { line: number; character?: number },
  to: { line: number; character?: number },
) => {
  let l1 = {
    start: lineStartIndexes[from.line - 1],
    end: lineStartIndexes[from.line],
  };
  let l2 = {
    start: lineStartIndexes[to.line - 1],
    end: lineStartIndexes[to.line],
  };
  return {
    from: l1.start + (from.character !== undefined ? from.character : 0),
    to: to.character !== undefined ? l2.start + to.character : l2.end,
    width:
      (to.character !== undefined ? to.character : l2.end - l2.start) -
      (from.character !== undefined ? from.character : 0),
    height: to.line - from.line,
  };
};

const normalizeTooltips = (
  lineStartIndexes: number[],
  items: Tooltip[],
): (Tooltip & {
  normalized: NormalizedItem;
})[] =>
  items.map((t) => {
    return {
      ...t,
      normalized: linePositionToNormalized(lineStartIndexes, t.from, t.to),
    };
  });

const normalizeCodeInputs = (
  lineStartIndexes: number[],
  items: CodeInput[],
): (CodeInput & { normalized: NormalizedItem[] })[] =>
  items.map((t) => {
    return {
      ...t,
      normalized: t.positions.map((p) =>
        linePositionToNormalized(
          lineStartIndexes,
          {
            character: p.pos,
            line: t.line,
          },
          {
            line: t.line,
            character: p.pos + t.width,
          },
        ),
      ),
    };
  });

export const createAnnotations = (
  code: string,
  tips: Tooltip[],
  inputs: CodeInput[],
) => {
  let lineStartIndexes = code
    .split("\n")
    .reduce(
      (acc, line) => {
        acc.push(acc[acc.length - 1] + line.length + 1);
        return acc;
      },
      [0],
    )
    .concat([code.length]);
  let processed = {
    tips: normalizeTooltips(lineStartIndexes, tips),
    inputs: normalizeCodeInputs(lineStartIndexes, inputs),
  };
  let valueToCode = (
    view: EditorView,
    key: string,
    text: string,
    inputElements: (HTMLInputElement | HTMLSelectElement)[],
  ) => {
    console.log("Mark 1", key, text);
    inputElements.forEach((input) => (input.value = text));
    const input = processed.inputs.find((i) => i.key === key)!;
    const rawInput = inputs.find((i) => i.key === key)!;
    input.value = text;
    rawInput.value = text;
    input.normalized.map((n) => {
      console.log("dispatching to", n.from, n.to);
      view.dispatch({
        filter: false,
        changes: {
          from: n.from,
          to: n.to,
          insert: text.padEnd(input.width).slice(0, input.width),
        },
      });
    });
  };
  let readonly = processed.tips
    .concat(processed.inputs as any)
    .reduce((previous, item) => Math.max(item.normalized.to, previous), 0);
  let extensions = [
    preventModifyTargetRanges(() => [{ from: 0, to: readonly }]),
    hoverTooltip((view, pos, side) => {
      let matching = processed.tips.find(
        ({ normalized, text }) =>
          text && pos >= normalized.from && pos <= normalized.to,
      );
      if (!matching) return null;
      return {
        pos: matching.normalized.from,
        end: matching.normalized.to,
        above: true,
        create(view) {
          let dom = document.createElement("div");
          dom.className = "tooltip";
          dom.innerHTML = matching.text!;
          return { dom };
        },
      };
    }),
    ViewPlugin.define(
      (view) => {
        let inputs = processed.inputs.map((params) => ({
          key: params.key,
          params,
          inputs: params.positions.map((p) => createInputElement(params)),
        }));
        return {
          inputs: RangeSet.of(
            inputs
              .map((input) => {
                input.inputs.map((element) => {
                  console.log("adding event listener for", element);
                  element.addEventListener("change", (event: any) => {
                    console.log("got change event", event);
                    valueToCode(
                      view,
                      input.key,
                      event.target.value as string,
                      input.inputs,
                    );
                  });
                });

                return input.params.positions.map((p, idx) => {
                  return Decoration.replace({
                    widget: new InputWidget(input.inputs[idx], p.id),
                  }).range(
                    input.params.normalized[idx].from,
                    input.params.normalized[idx].to,
                  );
                });
              })
              .flat()
              .toSorted((a, b) => a.from - b.from),
          ),
        };
      },
      {
        decorations: (instance) => instance.inputs,
      },
    ),
    ViewPlugin.define(
      (view) => ({
        marks: RangeSet.of(
          processed.tips
            .filter((t) => t.text)
            .map(({ normalized }) =>
              Decoration.mark({
                inclusive: true,
                inclusiveStart: true,
                inclusiveEnd: true,
                class: "cm-placeholder",
              }).range(normalized.from, normalized.to),
            ),
        ),
      }),
      { decorations: ({ marks }) => marks },
    ),
  ];
  const onReady = (view: EditorView) =>
    processed.inputs.map(({ key, value }) => {
      valueToCode(view, key, value, []);
    });
  return { extensions, onReady };
};
