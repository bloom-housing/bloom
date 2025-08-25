import React, { useCallback, useState } from "react"
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

export const EditorExtensions = [
  StarterKit.configure({
    heading: false,
    code: false,
    blockquote: false,
    codeBlock: false,
    italic: false,
  }),
  CharacterCountExtension,
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
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    // update link
    try {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    } catch (e) {
      alert(e.message)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const customKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    beforeId: string,
    afterId: string
  ) => {
    if (e.key === "ArrowRight") {
      document.getElementById(afterId).focus()
    }
    if (e.key === "ArrowLeft") {
      document.getElementById(beforeId).focus()
    }
  }

  return (
    <div className={styles["editor-menu"]} role={"menubar"}>
      <button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor?.can().chain().focus().toggleBold().run()}
        className={editor?.isActive("bold") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Bold"}
        id={"editor-bold"}
        role={"menuitem"}
        onKeyDown={(event) => {
          customKeyDown(event, "editor-line-break", "editor-bullet-list")
        }}
      >
        <Icon>
          <BoldIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={editor?.isActive("bulletList") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Bullet list"}
        id={"editor-bullet-list"}
        role={"menuitem"}
        onKeyDown={(event) => {
          customKeyDown(event, "editor-bold", "editor-numbered-list")
        }}
      >
        <Icon>
          <BulletListIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={editor?.isActive("orderedList") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Numbered list"}
        id={"editor-numbered-list"}
        role={"menuitem"}
        onKeyDown={(event) => {
          customKeyDown(event, "editor-bullet-list", "editor-set-link")
        }}
      >
        <Icon>
          <OrderedListIcon />
        </Icon>
      </button>
      <button
        onClick={setLink}
        className={editor?.isActive("link") ? styles["is-active"] : ""}
        type="button"
        aria-label={"Set link"}
        role={"menuitem"}
        id={"editor-set-link"}
        onKeyDown={(event) => {
          customKeyDown(
            event,
            "editor-numbered-list",
            editor?.isActive("link") ? "editor-unlink" : "editor-line-break"
          )
        }}
      >
        <Icon>
          <LinkIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor?.chain().focus().unsetLink().run()}
        disabled={!editor?.isActive("link")}
        type="button"
        aria-label={"Unlink"}
        role={"menuitem"}
        id={"editor-unlink"}
        onKeyDown={(event) => {
          customKeyDown(event, "editor-set-link", "editor-line-break")
        }}
      >
        <Icon>
          <UnlinkIcon />
        </Icon>
      </button>
      <button
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        type="button"
        aria-label={"Line break"}
        id={"editor-line-break"}
        role={"menuitem"}
        onKeyDown={(event) => {
          customKeyDown(
            event,
            editor?.isActive("link") ? "editor-unlink" : "editor-numbered-list",
            "editor-bold"
          )
        }}
      >
        <Icon>
          <DividerIcon />
        </Icon>
      </button>
    </div>
  )
}

const getCharacterString = (characterCount: number, characterLimit: number) => {
  const charactersRemaining = characterLimit - characterCount
  if (charactersRemaining === -1) {
    return t("t.characterOver", {
      count: charactersRemaining * -1,
    })
  }
  if (charactersRemaining < 0) {
    return t("t.charactersOver", {
      count: charactersRemaining * -1,
    })
  }
  if (charactersRemaining === 1)
    return t("t.character", {
      count: charactersRemaining,
    })
  return t("t.characters", {
    count: charactersRemaining,
  })
}

type TextEditorProps = {
  characterLimit?: number
  editor: Editor
  editorId?: string
  error?: boolean
  errorMessage?: string
  label: string | React.ReactNode
}

export const TextEditor = ({
  characterLimit = 1000,
  editor,
  editorId,
  error,
  errorMessage,
  label,
}: TextEditorProps) => {
  const [errorState, setErrorState] = useState(error)

  const labelId = `${editorId}Label`

  if (!editor) {
    return null
  }

  editor.on("update", () => {
    if (errorState) setErrorState(false)
  })

  editor.on("create", () => {
    editor?.view.setProps({
      attributes: { "aria-labelledby": labelId, role: "textbox" },
    })
  })

  const characterCount = editor?.storage?.characterCount?.characters()
  const overLimit = characterCount > characterLimit

  return (
    <>
      <label id={labelId}>
        <span className={`${styles["label"]} ${errorState ? styles["error-text"] : null}`}>
          {label}
        </span>
      </label>
      <div className={`${styles["editor"]} ${overLimit || errorState ? styles["error"] : ""}`}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} id={editorId} data-testid={editorId} />
      </div>
      <div
        className={`${styles["character-count"]} ${
          overLimit ? styles["character-count-warning"] : ""
        }`}
      >
        {getCharacterString(characterCount, characterLimit)}
      </div>
      {errorState && errorMessage ? <div className={"error-message"}>{errorMessage}</div> : null}
    </>
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
