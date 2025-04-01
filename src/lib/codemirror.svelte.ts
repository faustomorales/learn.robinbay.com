import {
    EditorView,
    WidgetType,
    Decoration,
    ViewPlugin,
    hoverTooltip,
} from "@codemirror/view";
import { RangeSet } from "@codemirror/state";

export type CodeInput = { id: string; from: number; to: number; line: number, options?: string[] }
export type Tooltip = { text?: string; from: number; to: number; line: number };

class DropdownWidget extends WidgetType {
    selected: string;
    options: string[];
    id: string;
    setValue: (text: string) => void;

    constructor(
        selected: string,
        options: string[],
        id: string,
        setValue: (text: string) => void,
    ) {
        super();
        this.selected = selected;
        this.options = options;
        this.id = id;
        this.setValue = setValue;
    }

    eq(other: DropdownWidget) {
        return other.id === this.id;
    }

    updateDOM(dom: HTMLElement, view: EditorView): boolean {
        return true;
    }

    toDOM() {
        // Create the select element
        const select = document.createElement("select");
        select.contentEditable = "true";

        // Loop through the options array and create an option element for each value
        this.options.forEach((optionText) => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;

            // If this option matches the selected value, mark it as selected
            if (optionText === this.selected) {
                option.selected = true;
            }

            // Append the option to the select element
            select.appendChild(option);
        });
        select.addEventListener("change", (event: any) =>
            this.setValue(event.target.value),
        );
        return select;
    }
}

const normalize = <ItemType extends Tooltip | CodeInput>(lineStartIndexes: number[], items: ItemType[]): ItemType[] => {
    return items.map((t) => {
        let line = t.line - 1;
        let lineStart = lineStartIndexes[line];
        let lineEnd = lineStartIndexes[line + 1]
        return {
            ...t,
            from: lineStart + (t.from || 0),
            to: t.to ? lineStart + t.to : lineEnd,
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
    return [
        hoverTooltip((view, pos, side) => {
            let matching = normalized.tips.find(
                ({ from, to, text }) => text && pos >= from && pos <= to,
            );
            if (!matching) return null;
            return {
                pos: matching.from,
                end: matching.to,
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
                dropdowns: RangeSet.of(
                    normalized.inputs
                        .filter((n) => n.options)
                        .map(({ from, to, options }) =>
                            Decoration.replace({
                                widget: new DropdownWidget(
                                    options![0],
                                    options!,
                                    `${from}-${to}`,
                                    (text: string) =>
                                        view.dispatch({
                                            changes: {
                                                from,
                                                to,
                                                insert: text,
                                            },
                                        }),
                                ),
                            }).range(from, to),
                        ),
                ),
            }),
            {
                decorations: (instance) => instance.dropdowns,
            },
        ),
        ViewPlugin.define(
            (view) => ({
                marks: RangeSet.of(
                    normalized.tips
                        .filter((t) => t.text)
                        .map(({ from, to }) =>
                            Decoration.mark({
                                inclusive: true,
                                inclusiveStart: true,
                                inclusiveEnd: true,
                                class: "cm-placeholder",
                            }).range(from, to),
                        ),
                ),
            }),
            { decorations: ({ marks }) => marks },
        ),
    ];
};
