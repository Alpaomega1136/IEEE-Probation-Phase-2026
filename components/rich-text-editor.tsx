"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ImagePlus,
  Link2,
  X,
  LoaderCircle,
} from "lucide-react";
import { isAllowedImageUrl } from "@/lib/description";
import { ImageFilePicker } from "@/components/image-file-picker";

export function RichTextEditor({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogType, setDialogType] = useState<"image" | "link">("image");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, defaultProtocol: "https" },
      }),
      Image,
    ],
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
      link: editor?.isActive("link"),
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

  function openDialog(type: "image" | "link") {
    setDialogType(type);
    setUrl(type === "link" ? editor?.getAttributes("link").href || "" : "");
    setAlt("");
    setFile(null);
    setError("");
    dialog.current?.showModal();
  }

  function insertLink() {
    const href = url.trim();
    let valid = false;
    try {
      valid = ["https:", "http:", "mailto:"].includes(new URL(href).protocol);
    } catch {
      valid = false;
    }
    if (!valid) {
      setError("Enter a valid web or email link.");
      return;
    }
    if (!editor) return;
    if (editor.state.selection.empty && !editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: href,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    dialog.current?.close();
  }

  async function insertImage() {
    if (pending) return;
    const description = alt.trim();
    if (!description) {
      setError("Describe the image for accessibility.");
      return;
    }
    if (imageMode === "url" && !isAllowedImageUrl(url.trim())) {
      setError("Enter a valid HTTPS image URL.");
      return;
    }
    if (imageMode === "upload" && !file) {
      setError("Choose an image to upload.");
      return;
    }
    setError("");
    setPending(true);
    let uploadedUrl = "";
    try {
      if (imageMode === "upload" && file) {
        const data = new FormData();
        data.set("image", file);
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: data,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(
            result.error?.message || "Could not upload the image.",
          );
        uploadedUrl = result.data.url;
      }
      const src = uploadedUrl || url.trim();
      if (!editor?.chain().focus().setImage({ src, alt: description }).run())
        throw new Error("Could not insert the image.");
      dialog.current?.close();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not insert the image.",
      );
      if (uploadedUrl)
        await fetch(uploadedUrl, { method: "DELETE" }).catch(() => {});
    } finally {
      setPending(false);
    }
  }

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
        <button
          type="button"
          title="Insert link"
          aria-label="Insert link"
          aria-pressed={state?.link ?? false}
          onClick={() => openDialog("link")}
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          title="Insert image"
          aria-label="Insert image"
          onClick={() => openDialog("image")}
        >
          <ImagePlus size={16} />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="rich-editor-content rich-text"
      />
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-labelledby="editor-dialog-title"
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            event.target instanceof HTMLInputElement &&
            event.target.type !== "file"
          ) {
            event.preventDefault();
            if (dialogType === "image") void insertImage();
            else insertLink();
          }
        }}
      >
        <div className="image-dialog-header">
          <h2 id="editor-dialog-title">
            {dialogType === "image" ? "Insert image" : "Insert link"}
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close dialog"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        {dialogType === "image" ? (
          <>
            <div className="image-mode" role="group" aria-label="Image source">
              <button
                type="button"
                className={imageMode === "upload" ? "active" : ""}
                aria-pressed={imageMode === "upload"}
                disabled={pending}
                onClick={() => {
                  setImageMode("upload");
                  setError("");
                }}
              >
                Upload photo
              </button>
              <button
                type="button"
                className={imageMode === "url" ? "active" : ""}
                aria-pressed={imageMode === "url"}
                disabled={pending}
                onClick={() => {
                  setImageMode("url");
                  setError("");
                }}
              >
                Image URL
              </button>
            </div>
            {imageMode === "upload" ? (
              <div className="field" key="upload">
                <ImageFilePicker
                  id="description-image-file"
                  disabled={pending}
                  fileName={file?.name}
                  onChange={(selected) => {
                    if (
                      selected &&
                      (selected.size > 5 * 1024 * 1024 ||
                        !["image/jpeg", "image/png", "image/webp"].includes(
                          selected.type,
                        ))
                    ) {
                      setFile(null);
                      setError(
                        "Choose a JPEG, PNG, or WebP image smaller than 5 MB.",
                      );
                    } else {
                      setFile(selected);
                      setError("");
                    }
                  }}
                />
              </div>
            ) : (
              <div className="field" key="url">
                <label htmlFor="description-image-url">Image URL (HTTPS)</label>
                <input
                  id="description-image-url"
                  type="url"
                  value={url}
                  disabled={pending}
                  placeholder="https://example.com/image.jpg"
                  onChange={(event) => setUrl(event.target.value)}
                />
              </div>
            )}
            <div className="field image-alt-field">
              <label htmlFor="description-image-alt">Image description</label>
              <input
                id="description-image-alt"
                value={alt}
                disabled={pending}
                onChange={(event) => setAlt(event.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor="description-link-url">Link URL</label>
            <input
              id="description-link-url"
              type="url"
              value={url}
              placeholder="https://example.com"
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>
        )}
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          {dialogType === "link" && state?.link && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                dialog.current?.close();
              }}
            >
              Remove link
            </button>
          )}
          <button
            type="button"
            className="button button-primary"
            disabled={pending}
            onClick={dialogType === "image" ? insertImage : insertLink}
          >
            {pending && <LoaderCircle size={16} className="spin" />}
            {dialogType === "image" ? "Insert image" : "Apply link"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
