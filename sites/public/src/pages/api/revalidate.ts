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
  const failed: string[] = []

  for (const path of paths) {
    try {
      await res.revalidate(path)
    } catch (error) {
      failed.push(path)
      console.error(`revalidate: ${path} failed:`, error)
    }
  }

  return res.status(200).json({ revalidated: paths.length - failed.length, failed })
}
