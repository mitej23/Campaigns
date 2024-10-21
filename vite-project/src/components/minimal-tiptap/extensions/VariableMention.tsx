/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import { Mention } from "@tiptap/extension-mention";
import { Editor, Range } from "@tiptap/core";

import ItemSelect from "./MentionList"; // Import for your component

type SuggestionProps = {
  query: string;
  editor: Editor;
  range: Range;
  clientRect: (() => DOMRect) | null;
};

type CommandProps = {
  editor: Editor;
  range: Range;
  props: { id: string; label: string };
};

export const VariableMention = Mention.configure({
  HTMLAttributes: {
    class: "variable-mention",
  },
}).extend({
  name: "variableMention",
  addOptions() {
    return {
      ...this.parent?.(),
      suggestion: {
        char: "{{",
        endChar: "}}",
        command: ({ editor, range, props }: CommandProps) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              //   {
              //     type: "text",
              //     text: "}}",
              //   },
            ])
            .run();
        },
        allow: ({ editor, range }: { editor: Editor; range: Range }) => {
          return editor.can().insertContentAt(range, { type: this.name });
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": this.name,
        class: "variable-mention variable-highlight", // Added class for styling
      },
      `{{${node.attrs.label}}}`,
    ];
  },
});

const suggestionOptions = {
  items: ({ query }: { query: string }) => {
    return ["name", "email"]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let component: ReactRenderer | undefined;
    let popup: TippyInstance[] | undefined;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(ItemSelect, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps) {
        component?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === "Escape") {
          popup?.[0].hide();
          return true;
        }

        return component?.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.[0].destroy();
        component?.destroy();
      },
    };
  },
};

export const VariableMentionExtension = VariableMention.configure({
  suggestion: suggestionOptions,
});

export default VariableMentionExtension;
