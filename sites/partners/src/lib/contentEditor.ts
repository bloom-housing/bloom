import {
  JurisdictionContent,
  JurisdictionContentUpdate,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type ContentDocument = "footer" | "faq" | "resources" | "disclaimers" | "contact"

export const CONTENT_DOCUMENTS: ContentDocument[] = [
  "disclaimers",
  "contact",
  "faq",
  "resources",
  "footer",
]

export type ContentDraft = Pick<JurisdictionContent, ContentDocument>

/**
 * What a field is doing in a language row.
 *
 * `fallback` is an unset field, which renders the English value. `hidden` is a field set to empty,
 * which renders nothing and is how an admin removes a section for one language. The two look alike
 * in a text box, so the editor keeps them apart with separate controls.
 */
export type FieldState = "fallback" | "hidden" | "overridden"

export const rowFor = (rows: JurisdictionContent[] | undefined, language: LanguagesEnum) =>
  rows?.find((row) => row.language === language)

export const draftFromRow = (row?: JurisdictionContent): ContentDraft => ({
  disclaimers: row?.disclaimers,
  contact: row?.contact,
  faq: row?.faq,
  resources: row?.resources,
  footer: row?.footer,
})

const segments = (path: string) => path.split(".")

export const valueAt = (draft: ContentDraft | undefined, path: string): unknown =>
  segments(path).reduce<unknown>(
    (node, segment) =>
      node && typeof node === "object" ? (node as Record<string, unknown>)[segment] : undefined,
    draft
  )

const withValueAt = (
  draft: ContentDraft,
  path: string,
  apply: (parent: Record<string, unknown>, field: string) => void
): ContentDraft => {
  const next = JSON.parse(JSON.stringify(draft ?? {})) as Record<string, unknown>
  const parts = segments(path)
  const field = parts.pop()

  let node = next
  for (const part of parts) {
    if (!node[part] || typeof node[part] !== "object") {
      node[part] = {}
    }
    node = node[part] as Record<string, unknown>
  }

  apply(node, field)
  return next as ContentDraft
}

export const setValueAt = (draft: ContentDraft, path: string, value: string): ContentDraft =>
  withValueAt(draft, path, (parent, field) => {
    parent[field] = value
  })

// Clearing a field is not the same as emptying it: an absent field falls back to English.
export const clearValueAt = (draft: ContentDraft, path: string): ContentDraft =>
  withValueAt(draft, path, (parent, field) => {
    delete parent[field]
  })

export const fieldState = (value: unknown): FieldState => {
  if (value === undefined || value === null) return "fallback"
  return value === "" ? "hidden" : "overridden"
}

export const isStale = (staleFields: string[] | undefined, path: string) =>
  (staleFields ?? []).includes(path)

/**
 * Paths the admin has emptied where English has something to show, so saving would remove that
 * section for this language. The page confirms these before saving.
 */
export const pathsThatHideContent = (
  draft: ContentDraft,
  english: ContentDraft | undefined,
  paths: string[]
) =>
  paths.filter((path) => fieldState(valueAt(draft, path)) === "hidden" && !!valueAt(english, path))

export const hasDraftChanges = (draft: ContentDraft, saved: ContentDraft) =>
  JSON.stringify(draft) !== JSON.stringify(saved)

export const buildUpdate = (
  draft: ContentDraft,
  lastUpdatedAt?: Date
): JurisdictionContentUpdate => ({
  ...draft,
  lastUpdatedAt,
})

export const isConflict = (error: unknown) => {
  const response = (error as { response?: { status?: number } })?.response
  return response?.status === 409
}
