import React, { useCallback } from "react"
import { EditorContent, Editor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Link as LinkExtension } from "@tiptap/extension-link"
import BoldIcon from "@heroicons/react/16/solid/BoldIcon"
import BulletListIcon from "@heroicons/react/16/solid/ListBulletIcon"
import OrderedListIcon from "@heroicons/react/16/solid/NumberedListIcon"
import ItalicIcon from "@heroicons/react/16/solid/ItalicIcon"
import DividerIcon from "@heroicons/react/16/solid/MinusIcon"
import LinkIcon from "@heroicons/react/16/solid/LinkIcon"
import UnlinkIcon from "@heroicons/react/16/solid/LinkSlashIcon"
import { Icon } from "@bloom-housing/ui-seeds"
import styles from "./TextEditor.module.scss"

export const EditorExtensions = [
  StarterKit,
  LinkExtension.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: (url, ctx) => {
      try {
        // construct URL
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`)

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false
        }

        const protocol = parsedUrl.protocol.replace(":", "")

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme))

        if (!allowedProtocols.includes(protocol)) {
          return false
        }

        return true
      } catch {
        return false
      }
    },
  }),
]

const MenuBar = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    // update link
    try {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    } catch (e) {
      alert(e.message)
    }
  }, [editor])

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
        <Icon>
          <BoldIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        type="button"
      >
        <Icon>
          <ItalicIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        type="button"
      >
        <Icon>
          <BulletListIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        type="button"
      >
        <Icon>
          <OrderedListIcon />
        </Icon>
      </button>

      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button">
        <Icon>
          <DividerIcon />
        </Icon>
      </button>
      <button
        onClick={setLink}
        className={editor.isActive("link") ? "is-active" : ""}
        type="button"
      >
        <Icon>
          <LinkIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        type="button"
      >
        <Icon>
          <UnlinkIcon />
        </Icon>
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
