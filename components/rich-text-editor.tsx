"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

export function RichTextEditor({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        "aria-label": "Description",
        "aria-invalid": String(invalid),
      },
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      format: editor?.isActive("heading", { level: 2 })
        ? "h2"
        : editor?.isActive("heading", { level: 3 })
          ? "h3"
          : "p",
      bold: editor?.isActive("bold"),
      italic: editor?.isActive("italic"),
      bulletList: editor?.isActive("bulletList"),
      orderedList: editor?.isActive("orderedList"),
      blockquote: editor?.isActive("blockquote"),
      undo: editor?.can().undo(),
      redo: editor?.can().redo(),
    }),
  });
  const tools = [
    {
      label: "Bold",
      Icon: Bold,
      active: state?.bold,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      Icon: Italic,
      active: state?.italic,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Bulleted list",
      Icon: List,
      active: state?.bulletList,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      Icon: ListOrdered,
      active: state?.orderedList,
      run: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      Icon: Quote,
      active: state?.blockquote,
      run: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Undo",
      Icon: Undo2,
      disabled: !state?.undo,
      run: () => editor?.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      Icon: Redo2,
      disabled: !state?.redo,
      run: () => editor?.chain().focus().redo().run(),
    },
  ];
  return (
    <div className="rich-editor" data-invalid={invalid}>
      <div
        className="rich-editor-toolbar"
        role="toolbar"
        aria-label="Description formatting"
      >
        <select
          aria-label="Text style"
          title="Text style"
          value={state?.format ?? "p"}
          onChange={(event) => {
            const format = event.target.value;
            if (format === "p") editor?.chain().focus().setParagraph().run();
            else
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: format === "h2" ? 2 : 3 })
                .run();
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        {tools.map(({ label, Icon, active, disabled, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active ?? undefined}
            disabled={disabled}
            onClick={run}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="rich-editor-content rich-text"
      />
    </div>
  );
}
