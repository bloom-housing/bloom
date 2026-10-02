import { timingSafeEqual } from "crypto"
import type { NextApiRequest, NextApiResponse } from "next"
import { clearCachedApiReads } from "../../lib/hooks"

/*
  Rebuilds the pages an admin edit can change, so a save shows up without waiting out the ISR
  window. The api calls this after writing a translation, a content document or a brand.
*/

// Every statically generated page that reads the shared jurisdiction content, which is any page
// exporting sharedGetStaticProps or calling fetchSharedPageProps directly.
//
// /404 and /500 are left out: Next records them separately from the prerendered routes, so
// revalidating them would report a failure on save.
export const REVALIDATED_PATHS = [
  "/",
  "/account/applications",
  "/account/applications/closed",
  "/account/applications/lottery",
  "/account/applications/open",
  "/account/dashboard",
  "/account/favorites",
  "/additional-resources",
  "/applications/community-types/community-types",
  "/applications/contact/address",
  "/applications/contact/alternate-contact-contact",
  "/applications/contact/alternate-contact-name",
  "/applications/contact/alternate-contact-type",
  "/applications/contact/name",
  "/applications/financial/income",
  "/applications/financial/vouchers",
  "/applications/household/ada",
  "/applications/household/add-members",
  "/applications/household/changes",
  "/applications/household/live-alone",
  "/applications/household/member",
  "/applications/household/members-info",
  "/applications/household/preferred-units",
  "/applications/household/reasonable-accommodations",
  "/applications/household/student",
  "/applications/preferences/all",
  "/applications/preferences/general",
  "/applications/programs/programs",
  "/applications/review/confirmation",
  "/applications/review/demographics",
  "/applications/review/summary",
  "/applications/review/terms",
  "/applications/start/autofill",
  "/applications/start/choose-language",
  "/applications/start/community-disclaimer",
  "/applications/start/what-to-expect",
  "/applications/view",
  "/create-account",
  "/create-advocate-account-confirmation",
  "/disclaimer",
  "/faq",
  "/finder",
  "/forgot-password",
  "/get-assistance",
  "/housing-basics",
  "/privacy",
  "/professional-partners",
  "/reset-password",
  "/sign-in",
  "/verify",
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

const matches = (supplied: string | string[] | undefined, secret: string): boolean => {
  if (typeof supplied !== "string") return false

  const a = Buffer.from(supplied)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Use POST" })
  }

  const secret = process.env.PUBLIC_SITE_REVALIDATE_SECRET
  if (!secret) {
    console.error("revalidate: PUBLIC_SITE_REVALIDATE_SECRET is not set")
    return res.status(503).json({ message: "Revalidation is not configured" })
  }

  if (!matches(req.headers["revalidate-secret"], secret)) {
    // Logged so a caller probing this route leaves a trace.
    console.error("revalidate: rejected a call with no matching secret")
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
