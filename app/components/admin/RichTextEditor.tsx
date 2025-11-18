'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Pilcrow
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content here...",
  required = false 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    immediatelyRender: false, // Add this line to fix SSR
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  // Show loading state until component is mounted
  if (!isMounted) {
    return (
      <div className="w-full min-h-[400px] border border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#c71f37] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border border-gray-300 rounded-t-xl bg-[#f9fafb] border-b-0">
        {/* Headings */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('heading', { level: 1 }) ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('heading', { level: 2 }) ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('heading', { level: 3 }) ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('paragraph') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('bold') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('italic') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('strike') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('code') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('bulletList') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('orderedList') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Blockquote */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor?.isActive('blockquote') ? 'bg-[#c71f37] text-white' : 'text-gray-700'
            }`}
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Rule */}
        <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            type="button"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center">
          <button
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-xl border-t-0 focus-within:border-[#c71f37] focus-within:ring-2 focus-within:ring-[#c71f37] focus-within:ring-opacity-10 transition-all duration-200">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .rich-text-editor .ProseMirror {
          min-height: 400px;
          padding: 1rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          outline: none;
        }

        .rich-text-editor .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.2;
        }

        .rich-text-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.3;
        }

        .rich-text-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }

        .rich-text-editor .ProseMirror p {
          margin-bottom: 1rem;
        }

        .rich-text-editor .ProseMirror ul, 
        .rich-text-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .rich-text-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .rich-text-editor .ProseMirror li {
          margin: 0.25rem 0;
        }

        .rich-text-editor .ProseMirror blockquote {
          border-left: 4px solid #c71f37;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }

        .rich-text-editor .ProseMirror code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .rich-text-editor .ProseMirror pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .rich-text-editor .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: 0.875rem;
        }

        .rich-text-editor .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        .rich-text-editor .ProseMirror:focus {
          outline: none;
        }

        .rich-text-editor .ProseMirror .is-empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Placeholder styling */
        .rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}