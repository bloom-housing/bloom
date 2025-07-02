import React from "react"
import { EditorContent, Editor } from "@tiptap/react"
import styles from "./TextEditor.module.scss"

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className={styles["editor-menu"]}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        type="button"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        type="button"
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        type="button"
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        type="button"
      >
        Ordered list
      </button>

      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button">
        Horizontal rule
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        type="button"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        type="button"
      >
        Redo
      </button>
    </div>
  )
}

type TextEditorProps = {
  editor: Editor
}

const TextEditor = ({ editor }: TextEditorProps) => {
  return (
    <div className={styles["editor"]}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor
