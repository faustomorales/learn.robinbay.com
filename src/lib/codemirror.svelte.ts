import {
    EditorView,
    WidgetType,
    Decoration,
    ViewPlugin,
    hoverTooltip,
} from "@codemirror/view";
import { preventModifyTargetRanges } from 'codemirror-readonly-ranges'
import { RangeSet } from "@codemirror/state";


export type Language = "html" | "css" | "js"
export type CodeInput = { language: Language, from: { line: number, character?: number }, to: { line: number, character?: number }, id: string, value: string, options?: string[] }
export type Tooltip = { language: Language, from: { line: number, character?: number }, to: { line: number, character?: number }, text: string; }
export type ReadonlySettings = boolean | { lines: number }

class InputWidget extends WidgetType {
    value: string;
    options?: string[];
    id: string;
    width: number;
    setValue: (text: string) => void;

    constructor(
        value: string,
        width: number,
        id: string,
        setValue: (text: string) => void,
        options?: string[],
    ) {
        super();
        this.value = value;
        this.options = options;
        this.id = id;
        this.width = width;
        this.setValue = setValue;
    }

    eq(other: InputWidget) {
        return other.id === this.id;
    }

    updateDOM(dom: HTMLElement, view: EditorView): boolean {
        return true;
    }

    toDOM() {
        let input = document.createElement(this.options ? "select" : "input");
        input.classList.add(...[
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
            "focus:shadow"
        ])
        input.contentEditable = "true";
        // Loop through the options array and create an option element for each value
        if (this.options) {
            this.options.forEach((optionText) => {
                const option = document.createElement("option");
                option.value = optionText;
                option.textContent = optionText;

                // If this option matches the selected value, mark it as selected
                if (optionText === this.value) {
                    option.selected = true;
                }

                // Append the option to the select element
                input.appendChild(option);
            });
        } else {
            input.size = this.width;
        }
        input.value = this.value;
        input.addEventListener(
            "change",
            (event: any) => this.setValue(
                (event.target.value as string)
            ),
        );
        return input;
    }
}

const normalize = <ItemType extends Tooltip | CodeInput>(lineStartIndexes: number[], items: ItemType[]): (ItemType & { normalized: { from: number, to: number, width: number, height: number } })[] => {
    return items.map((t) => {
        let l1 = { start: lineStartIndexes[t.from.line - 1], end: lineStartIndexes[t.from.line] };
        let l2 = { start: lineStartIndexes[t.to.line - 1], end: lineStartIndexes[t.to.line] };
        return {
            ...t,
            normalized: {
                from: l1.start + (t.from.character !== undefined ? t.from.character : 0),
                to: t.to.character !== undefined ? l2.start + t.to.character : l2.end,
                width: (t.to.character !== undefined ? t.to.character : l2.end - l2.start) - (t.from.character !== undefined ? t.from.character : 0),
                height: t.to.line - t.from.line
            }
        };
    });
}


export const createAnnotations = (code: string, tips: Tooltip[], inputs: CodeInput[]) => {
    let lineStartIndexes = code.split("\n").reduce(
        (acc, line) => {
            acc.push(acc[acc.length - 1] + line.length + 1);
            return acc;
        },
        [0],
    ).concat([code.length]);
    let normalized = {
        tips: normalize(lineStartIndexes, tips),
        inputs: normalize(lineStartIndexes, inputs),
    }
    let extensions = [
        hoverTooltip((view, pos, side) => {
            let matching = normalized.tips.find(
                ({ normalized, text }) => text && pos >= normalized.from && pos <= normalized.to,
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
            (view) => ({
                inputs: RangeSet.of(
                    normalized.inputs
                        .map(({ normalized, options, id, value }, index) =>
                            Decoration.replace({
                                widget: new InputWidget(
                                    value,
                                    normalized.width,
                                    id,
                                    (text: string) => {
                                        inputs[index].value = text;
                                        view.dispatch({
                                            changes: {
                                                from: normalized.from,
                                                to: normalized.to,
                                                insert: text.padEnd(normalized.width).slice(0, normalized.width),
                                            },
                                        })
                                    },
                                    options,
                                ),
                            }).range(normalized.from, normalized.to),
                        ),
                ),
            }),
            {
                decorations: (instance) => instance.inputs,
            },
        ),
        ViewPlugin.define(
            (view) => ({
                marks: RangeSet.of(
                    normalized.tips
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

    return extensions
};
