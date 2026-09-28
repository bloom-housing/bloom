import type { NextApiRequest, NextApiResponse } from "next"
import { clearCachedApiReads } from "../../lib/hooks"

/*
  Rebuilds the pages an admin edit can change, so a save shows up without waiting out the ISR
  window. The api calls this after writing a translation, a content document or a brand.
*/

// Statically generated pages that read the shared jurisdiction content.
export const REVALIDATED_PATHS = [
  "/",
  "/additional-resources",
  "/faq",
  "/finder",
  "/get-assistance",
  "/professional-partners",
  "/sign-in",
  "/account/dashboard",
  "/account/favorites",
  "/account/applications",
  "/account/applications/open",
  "/account/applications/closed",
  "/account/applications/lottery",
]

const DEFAULT_LOCALE = "en"

export const localisedPaths = (locales: string[]): string[] =>
  locales.flatMap((locale) =>
    REVALIDATED_PATHS.map((path) =>
      locale === DEFAULT_LOCALE ? path : `/${locale}${path === "/" ? "" : path}`
    )
  )

const configuredLocales = (): string[] =>
  process.env.LANGUAGES ? process.env.LANGUAGES.split(",") : [DEFAULT_LOCALE]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Use POST" })
  }

  const secret = process.env.API_PASS_KEY
  if (!secret) {
    console.error("revalidate: API_PASS_KEY is not set")
    return res.status(503).json({ message: "Revalidation is not configured" })
  }

  if (req.headers.passkey !== secret) {
    return res.status(401).json({ message: "Traffic not from a known source" })
  }

  clearCachedApiReads()

  const paths = localisedPaths(configuredLocales())

  // Responds before the rebuilds run.
  res.status(202).json({ accepted: paths.length })

  await rebuild(res, paths)
  return undefined
}

// Rendering is synchronous work on the process that also serves visitors, so a few at a time rather
// than all of them.
const CONCURRENCY = 4

const rebuild = async (res: NextApiResponse, paths: string[]): Promise<void> => {
  const queue = [...paths]
  const failed: string[] = []

  const worker = async (): Promise<void> => {
    for (let path = queue.shift(); path; path = queue.shift()) {
      try {
        await res.revalidate(path)
      } catch (error) {
        failed.push(path)
        console.error(`revalidate: ${path} failed:`, error)
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (failed.length) {
    console.error(`revalidate: ${failed.length} of ${paths.length} paths failed`)
  }
}
