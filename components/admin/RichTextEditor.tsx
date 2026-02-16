"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import { uploadImage } from "@/actions/media";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Minus,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type BlockFormat =
  | "paragraph"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "blockquote";

type ToolbarState = {
  currentBlock: BlockFormat;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
  bulletList: boolean;
  orderedList: boolean;
  blockquote: boolean;
  link: boolean;
  canUndo: boolean;
  canRedo: boolean;
};

const DEFAULT_TOOLBAR_STATE: ToolbarState = {
  currentBlock: "paragraph",
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  link: false,
  canUndo: false,
  canRedo: false,
};

const TOOLBAR_BASE_BUTTON =
  "btn-sm inline-flex !h-9 !w-9 !min-h-0 !p-0 items-center justify-center rounded-md border border-border-subtle text-text-secondary transition-colors";
const TOOLBAR_ACTIVE_BUTTON =
  "bg-amber-300 text-slate-900 border-amber-400 hover:bg-amber-300 hover:text-slate-900";
const TOOLBAR_IDLE_BUTTON =
  "bg-bg-primary hover:bg-bg-tertiary hover:text-text-primary";
const TOOLBAR_DISABLED_BUTTON =
  "opacity-40 cursor-not-allowed hover:bg-bg-primary hover:text-text-secondary";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toEditorContent(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "<p></p>";

  if (/<\/?[a-z][\s\S]*>/i.test(trimmed)) {
    return value;
  }

  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    );

  return paragraphs.length > 0 ? paragraphs.join("") : "<p></p>";
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your article...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestExternalContent = useRef(content);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-accent-main underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "my-4 rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: toEditorContent(content),
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] max-w-none px-4 py-5 focus:outline-none text-text-primary " +
          "[&_p]:my-3 [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-4xl [&_h1]:font-bold " +
          "[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-semibold " +
          "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-2xl [&_h3]:font-semibold " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-main [&_blockquote]:pl-4 [&_blockquote]:italic " +
          "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-bg-tertiary [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm " +
          "[&_code]:rounded [&_code]:bg-bg-tertiary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm " +
          "[&_a]:text-accent-main [&_a]:underline [&_hr]:my-6 [&_hr]:border-border-subtle",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      if (html !== latestExternalContent.current) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    latestExternalContent.current = content;
    if (!editor) return;

    const normalized = toEditorContent(content);
    if (normalized !== editor.getHTML()) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [content, editor]);

  const toolbarStateValue = useEditorState({
    editor,
    selector: ({ editor: activeEditor }) => {
      if (!activeEditor) {
        return DEFAULT_TOOLBAR_STATE;
      }

      const currentBlock: BlockFormat = activeEditor.isActive("heading", {
        level: 1,
      })
        ? "heading-1"
        : activeEditor.isActive("heading", { level: 2 })
          ? "heading-2"
          : activeEditor.isActive("heading", { level: 3 })
          ? "heading-3"
          : activeEditor.isActive("blockquote")
            ? "blockquote"
            : "paragraph";

      return {
        currentBlock,
        bold: activeEditor.isActive("bold"),
        italic: activeEditor.isActive("italic"),
        underline: activeEditor.isActive("underline"),
        strike: activeEditor.isActive("strike"),
        alignLeft: activeEditor.isActive({ textAlign: "left" }),
        alignCenter: activeEditor.isActive({ textAlign: "center" }),
        alignRight: activeEditor.isActive({ textAlign: "right" }),
        alignJustify: activeEditor.isActive({ textAlign: "justify" }),
        bulletList: activeEditor.isActive("bulletList"),
        orderedList: activeEditor.isActive("orderedList"),
        blockquote: activeEditor.isActive("blockquote"),
        link: activeEditor.isActive("link"),
        canUndo: activeEditor.can().chain().focus().undo().run(),
        canRedo: activeEditor.can().chain().focus().redo().run(),
      };
    },
  });
  const toolbarState = toolbarStateValue ?? DEFAULT_TOOLBAR_STATE;

  const handleBlockChange = useCallback(
    (nextBlock: BlockFormat) => {
      if (!editor) return;

      const chain = editor.chain().focus();
      switch (nextBlock) {
        case "paragraph":
          chain.clearNodes().setParagraph().run();
          break;
        case "heading-1":
          chain.clearNodes().toggleHeading({ level: 1 }).run();
          break;
        case "heading-2":
          chain.clearNodes().toggleHeading({ level: 2 }).run();
          break;
        case "heading-3":
          chain.clearNodes().toggleHeading({ level: 3 }).run();
          break;
        case "blockquote":
          chain.toggleBlockquote().run();
          break;
      }
    },
    [editor],
  );

  const addLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previous =
      (editor.getAttributes("link").href as string | undefined) || "https://";
    const url = window.prompt("Enter URL", previous);
    if (!url) return;

    const sanitized = url.trim();
    if (!sanitized) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: sanitized })
      .run();
  }, [editor]);

  const removeAllFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
        toast.success("Image uploaded");
      } else {
        toast.error(result.error || "Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!editor) {
    return (
      <div className="h-[500px] animate-pulse rounded-xl bg-bg-tertiary" />
    );
  }

  const ToolbarButton = ({
    title,
    onClick,
    isActive,
    disabled,
    children,
  }: {
    title: string;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
      className={[
        TOOLBAR_BASE_BUTTON,
        isActive ? TOOLBAR_ACTIVE_BUTTON : TOOLBAR_IDLE_BUTTON,
        disabled ? TOOLBAR_DISABLED_BUTTON : "",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-secondary">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        disabled={isUploading}
      />

      <div className="border-b border-border-subtle bg-bg-card px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={toolbarState.currentBlock}
            onChange={(event) =>
              handleBlockChange(event.target.value as BlockFormat)
            }
            className="!h-9 min-w-[160px] rounded-md border border-border-subtle bg-bg-primary px-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-main/30"
          >
            <option value="paragraph">Paragraph</option>
            <option value="heading-1">Heading 1</option>
            <option value="heading-2">Heading 2</option>
            <option value="heading-3">Heading 3</option>
            <option value="blockquote">Blockquote</option>
          </select>

          <div className="mx-1 h-6 w-px bg-border-subtle" />

          <ToolbarButton
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={toolbarState.bold}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={toolbarState.italic}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={toolbarState.underline}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={toolbarState.strike}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-border-subtle" />

          <ToolbarButton
            title="Align Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={toolbarState.alignLeft}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={toolbarState.alignCenter}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={toolbarState.alignRight}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={toolbarState.alignJustify}
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-border-subtle" />

          <ToolbarButton
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={toolbarState.bulletList}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={toolbarState.orderedList}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Quote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={toolbarState.blockquote}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Horizontal Rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-border-subtle" />

          <ToolbarButton
            title={toolbarState.link ? "Edit/Remove Link" : "Add Link"}
            onClick={addLink}
            isActive={toolbarState.link}
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Remove Link"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!toolbarState.link}
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Insert Image"
            onClick={triggerImageUpload}
            disabled={isUploading}
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px bg-border-subtle" />

          <ToolbarButton title="Clear Formatting" onClick={removeAllFormatting}>
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!toolbarState.canUndo}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!toolbarState.canRedo}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
