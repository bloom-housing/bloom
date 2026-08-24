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

/**
 * A path addresses a field inside a document, with list items named by id rather than by position:
 * `faq.categories[applying].items[how].answerHtml`. This is the same form the API uses for the
 * stale fields it reports.
 */
type PathSegment = { field: string } | { id: string }

export const parsePath = (path: string): PathSegment[] =>
  path.split(".").flatMap((part) => {
    const [field, ...ids] = part.split("[")
    return [...(field ? [{ field }] : []), ...ids.map((id) => ({ id: id.replace("]", "") }))]
  })

const isIdSegment = (segment: PathSegment): segment is { id: string } => "id" in segment

// Footer text sections are positional rather than keyed by id, so they are addressed by index.
const isIndexSegment = (segment: PathSegment) =>
  !isIdSegment(segment) && /^\d+$/.test(segment.field)

const childOf = (node: unknown, segment: PathSegment): unknown => {
  if (!node || typeof node !== "object") return undefined
  if (isIdSegment(segment)) {
    return Array.isArray(node)
      ? node.find((item) => (item as ListItem)?.id === segment.id)
      : undefined
  }
  return (node as Record<string, unknown>)[segment.field]
}

export const valueAt = (draft: ContentDraft | undefined, path: string): unknown =>
  parsePath(path).reduce<unknown>((node, segment) => childOf(node, segment), draft)

const withValueAt = (
  draft: ContentDraft,
  path: string,
  apply: (parent: Record<string, unknown>, field: string) => void
): ContentDraft => {
  const next = JSON.parse(JSON.stringify(draft ?? {})) as Record<string, unknown>
  const parts = parsePath(path)
  const last = parts.pop()

  if (!last || isIdSegment(last)) {
    return next as ContentDraft
  }

  let node: unknown = next
  parts.forEach((segment, index) => {
    let child = childOf(node, segment)
    if (!child || typeof child !== "object") {
      if (isIdSegment(segment)) {
        child = { id: segment.id }
        ;(node as ListItem[]).push(child as ListItem)
      } else {
        const following = parts[index + 1] ?? last
        child = isIdSegment(following) || isIndexSegment(following) ? [] : {}
        ;(node as Record<string, unknown>)[segment.field] = child
      }
    }
    node = child
  })

  apply(node as Record<string, unknown>, last.field)
  return next as ContentDraft
}

export const setValueAt = (draft: ContentDraft, path: string, value: string): ContentDraft =>
  withValueAt(draft, path, (parent, field) => {
    parent[field] = value
  })

// Clearing a field is not the same as emptying it: an absent field falls back to English.
export const clearValueAt = (draft: ContentDraft, path: string): ContentDraft =>
  withValueAt(draft, path, (parent, field) => {
    if (Array.isArray(parent) && /^\d+$/.test(field)) {
      parent.splice(Number(field), 1)
      return
    }
    delete parent[field]
  })

/**
 * An emptied rich-text editor reports `<p></p>` rather than an empty string. Storing that would
 * render an empty paragraph instead of hiding the field.
 */
export const normalizeRichText = (html: string): string => {
  const withoutEmptyBlocks = html.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "").trim()
  return withoutEmptyBlocks === "" ? "" : html
}

export const fieldState = (value: unknown): FieldState => {
  if (value === undefined || value === null) return "fallback"
  return value === "" ? "hidden" : "overridden"
}

export const isStale = (staleFields: string[] | undefined, path: string) =>
  (staleFields ?? []).includes(path)

export const isStaleWithin = (staleFields: string[] | undefined, itemPath: string) =>
  (staleFields ?? []).some(
    (path) => path.startsWith(`${itemPath}.`) && !path.slice(itemPath.length + 1).includes("[")
  )

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

export type ListItem = { id: string; _deleted?: boolean; [key: string]: unknown }

export type ListRow = {
  id: string
  english?: ListItem
  override?: ListItem
  deleted: boolean
}

const asList = (value: unknown): ListItem[] =>
  Array.isArray(value)
    ? (value.filter((item) => !!item && typeof item === "object") as ListItem[])
    : []

export const listRows = (englishValue: unknown, languageValue: unknown): ListRow[] => {
  const overrides = new Map(asList(languageValue).map((item) => [item.id, item]))
  const english = asList(englishValue)
  const seen = new Set(english.map((item) => item.id))

  return [
    ...english.map((item) => {
      const override = overrides.get(item.id)
      return { id: item.id, english: item, override, deleted: !!override?._deleted }
    }),
    ...asList(languageValue)
      .filter((item) => !seen.has(item.id))
      .map((item) => ({ id: item.id, override: item, deleted: !!item._deleted })),
  ]
}

// Ids only have to be stable and unique within their list.
export const newItemId = () =>
  `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const withList = (
  draft: ContentDraft,
  listPath: string,
  apply: (list: ListItem[]) => ListItem[]
): ContentDraft =>
  withValueAt(draft, listPath, (parent, field) => {
    parent[field] = apply(asList(parent[field]))
  })

export const addListItem = (draft: ContentDraft, listPath: string, item: ListItem): ContentDraft =>
  withList(draft, listPath, (list) => [...list, item])

export const removeListItem = (draft: ContentDraft, listPath: string, id: string): ContentDraft =>
  withList(draft, listPath, (list) => list.filter((item) => item.id !== id))

export const tombstoneListItem = (
  draft: ContentDraft,
  listPath: string,
  id: string
): ContentDraft =>
  withList(draft, listPath, (list) =>
    list.some((item) => item.id === id)
      ? list.map((item) => (item.id === id ? { ...item, _deleted: true } : item))
      : [...list, { id, _deleted: true }]
  )

export const restoreListItem = (draft: ContentDraft, listPath: string, id: string): ContentDraft =>
  withList(draft, listPath, (list) =>
    list
      .map((item) => {
        if (item.id !== id) return item
        const { _deleted, ...rest } = item
        void _deleted
        return rest as ListItem
      })
      .filter((item) => Object.keys(item).length > 1)
  )

const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((entry) => (typeof entry === "string" ? entry : "")) : []

export const textSections = (value: unknown): string[] => asStrings(value)

export const addTextSection = (draft: ContentDraft, path: string): ContentDraft => {
  const next = JSON.parse(JSON.stringify(draft ?? {})) as ContentDraft
  return setValueAt(next, `${path}.${asStrings(valueAt(next, path)).length}`, "")
}

export const removeTextSection = (
  draft: ContentDraft,
  path: string,
  index: number
): ContentDraft => {
  const kept = asStrings(valueAt(draft, path)).filter((_, position) => position !== index)
  return withValueAt(draft, path, (parent, field) => {
    parent[field] = kept
  })
}
