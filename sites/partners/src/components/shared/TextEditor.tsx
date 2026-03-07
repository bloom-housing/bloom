import React from "react"
import dynamic from "next/dynamic"
import Markdown from "markdown-to-jsx"
import type { Editor } from "@tiptap/react"
import styles from "./TextEditor.module.scss"

type TextEditorProps = {
  characterLimit?: number
  editor: Editor
  editorId?: string
  error?: boolean
  errorMessage?: string
  label: string | React.ReactNode
}

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
})

export const TextEditor = ({
  characterLimit = 1000,
  editor,
  editorId,
  error,
  errorMessage,
  label,
}: TextEditorProps) => {
  return (
    <RichTextEditor
      characterLimit={characterLimit}
      editor={editor}
      editorId={editorId}
      error={error}
      errorMessage={errorMessage}
      label={label}
    />
  )
}

type TextEditorContentProps = {
  content: string
  contentId?: string
}

export const TextEditorContent = ({ content, contentId }: TextEditorContentProps) => {
  return (
    <div className={`${styles["editor"]} ${styles["editor-text"]}`} id={contentId}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
