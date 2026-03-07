import { StarterKit } from "@tiptap/starter-kit"
import { Link as LinkExtension } from "@tiptap/extension-link"

export const EditorExtensions = [
  StarterKit.configure({
    heading: false,
    code: false,
    blockquote: false,
    codeBlock: false,
    italic: false,
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
        const parsedUrl = url.includes(":")
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`)

        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false
        }

        const protocol = parsedUrl.protocol.replace(":", "")

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
