import React, { useCallback } from "react"
import Markdown from "markdown-to-jsx"
import { EditorContent, Editor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Link as LinkExtension } from "@tiptap/extension-link"
import { CharacterCount as CharacterCountExtension } from "@tiptap/extension-character-count"
import BoldIcon from "@heroicons/react/16/solid/BoldIcon"
import BulletListIcon from "@heroicons/react/16/solid/ListBulletIcon"
import OrderedListIcon from "@heroicons/react/16/solid/NumberedListIcon"
import DividerIcon from "@heroicons/react/16/solid/MinusIcon"
import LinkIcon from "@heroicons/react/16/solid/LinkIcon"
import UnlinkIcon from "@heroicons/react/16/solid/LinkSlashIcon"
import { Icon } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import styles from "./TextEditor.module.scss"

const CHARACTER_LIMIT = 4000

export const EditorExtensions = [
  StarterKit.configure({
    heading: false,
  }),
  CharacterCountExtension.configure({
    limit: CHARACTER_LIMIT,
  }),
  LinkExtension.configure({
    openOnClick: true,
    autolink: true,
    defaultProtocol: "https",
    protocols: [
      "http",
      "https",
      { scheme: "mailto", optionalSlashes: true },
      { scheme: "tel", optionalSlashes: true },
    ],
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
        className={editor.isActive("bold") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Bold"}
      >
        <Icon>
          <BoldIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Bullet list"}
      >
        <Icon>
          <BulletListIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Numbered list"}
      >
        <Icon>
          <OrderedListIcon />
        </Icon>
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        type="button"
        aria-label={"Line break"}
      >
        <Icon>
          <DividerIcon />
        </Icon>
      </button>
      <button
        onClick={setLink}
        className={editor.isActive("link") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Set link"}
      >
        <Icon>
          <LinkIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        type="button"
        aria-label={"Unlink"}
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
  editorId?: string
}

export const TextEditor = ({ editor, editorId }: TextEditorProps) => {
  if (!editor) {
    return null
  }

  return (
    <div className={styles["editor"]}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} id={editorId} />
      <div
        className={`${styles["character-count"]} ${
          editor?.storage.characterCount.characters() > CHARACTER_LIMIT
            ? styles["character-count-warning"]
            : ""
        }`}
      >
        {t("t.characters", {
          count: `${editor?.storage.characterCount.characters()} / ${CHARACTER_LIMIT}`,
        })}
      </div>
    </div>
  )
}

type TextEditorContentProps = {
  content: string
  contentId?: string
}

export const TextEditorContent = ({ content, contentId }: TextEditorContentProps) => {
  return (
    <div className={styles["editor"]} id={contentId}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
