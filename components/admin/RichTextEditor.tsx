'use client';

/**
 * RichTextEditor — Tiptap-powered WYSIWYG for admin content fields.
 *
 * Outputs clean HTML compatible with the existing prose renderer on the
 * public site. No raw HTML tags visible to editors.
 *
 * Toolbar: Bold · Italic · H2 · H3 · Bullet list · Ordered list · Blockquote · Link · Clear
 */

import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  value:       string;
  onChange:    (html: string) => void;
  placeholder?: string;
  minHeight?:  number; // px, default 280
}

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick:   () => void;
  active?:   boolean;
  disabled?: boolean;
  title:     string;
  children:  React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`
        h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-bold transition-all
        ${active
          ? 'bg-amber-500 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
        }
        disabled:opacity-40 disabled:cursor-default
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder, minHeight = 280 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading:    { levels: [2, 3] },
        codeBlock:  false,
        code:       false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick:        false,
        HTMLAttributes: { class: 'text-primary-600 underline underline-offset-2 hover:text-primary-700' },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Start writing here…',
      }),
    ],
    content:     value || '',
    immediatelyRender: false, // SSR-safe
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? '' : editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
        spellcheck: 'true',
      },
    },
  });

  // Sync external value changes (e.g. when editing different record)
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '');
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url  = window.prompt('Enter URL:', prev ?? 'https://');
    if (url === null) return; // cancelled
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const can = editor.can();

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-50 transition-all bg-white">

      {/* ── Toolbar ── */}
      <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200">

        {/* Text style */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} disabled={!can.toggleBold()} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} disabled={!can.toggleItalic()} title="Italic (Ctrl+I)">
          <em>I</em>
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} title="Section heading (H2)">
          H2
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} title="Sub-heading (H3)">
          H3
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Bullet list">
          • List
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Numbered list">
          1. List
        </ToolBtn>

        <Divider />

        {/* Blockquote */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Blockquote">
          ❝
        </ToolBtn>

        {/* Link */}
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Insert / edit link">
          🔗
        </ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            ×🔗
          </ToolBtn>
        )}

        <Divider />

        {/* Undo / redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()}
          disabled={!can.undo()} title="Undo (Ctrl+Z)">
          ↩
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()}
          disabled={!can.redo()} title="Redo (Ctrl+Y)">
          ↪
        </ToolBtn>

        {/* Word count */}
        <span className="ml-auto font-jakarta text-[10px] text-slate-400 flex-shrink-0">
          {editor.storage.characterCount?.characters?.() ?? editor.getText().length} chars
        </span>
      </div>

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        className="px-5 py-4 font-jakarta text-sm text-slate-700 leading-relaxed
          [&_.tiptap]:outline-none
          [&_.tiptap_h2]:font-extrabold [&_.tiptap_h2]:text-slate-800 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:mb-3
          [&_.tiptap_h3]:font-bold [&_.tiptap_h3]:text-slate-700 [&_.tiptap_h3]:text-base [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:mb-2
          [&_.tiptap_p]:mb-3 [&_.tiptap_p]:leading-relaxed
          [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ul]:my-3 [&_.tiptap_ul_li]:mb-1
          [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_ol]:my-3 [&_.tiptap_ol_li]:mb-1
          [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-amber-400 [&_.tiptap_blockquote]:bg-amber-50 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:py-2 [&_.tiptap_blockquote]:rounded-r-xl [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-slate-600
          [&_.tiptap_a]:text-primary-600 [&_.tiptap_a]:underline
          [&_.tiptap_strong]:font-semibold [&_.tiptap_strong]:text-slate-800
          [&_.tiptap_em]:italic
          [&_.tiptap_.is-editor-empty:first-child:before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:first-child:before]:text-slate-400 [&_.tiptap_.is-editor-empty:first-child:before]:float-left [&_.tiptap_.is-editor-empty:first-child:before]:pointer-events-none [&_.tiptap_.is-editor-empty:first-child:before]:h-0
        "
        style={{ minHeight }}
      />
    </div>
  );
}
