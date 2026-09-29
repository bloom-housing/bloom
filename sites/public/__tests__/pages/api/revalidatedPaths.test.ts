import fs from "fs"
import path from "path"
import { REVALIDATED_PATHS } from "../../../src/pages/api/revalidate"

/*
  REVALIDATED_PATHS is written out by hand, so this derives the same set from the pages directory.
  Without it, a new statically generated page would render stale content after an admin edit and
  nothing would say so.
*/

const PAGES_DIR = path.join(__dirname, "../../../src/pages")

// Next records these separately from the prerendered routes, so the route leaves them out.
const NOT_REVALIDATED = ["/404", "/500"]

const pageFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === "api" ? [] : pageFiles(full)
    return entry.name.endsWith(".tsx") ? [full] : []
  })

const routeFor = (file: string): string => {
  const relative = path.relative(PAGES_DIR, file).replace(/\\/g, "/")
  return `/${relative.replace(/\.tsx$/, "").replace(/\/?index$/, "")}` || "/"
}

const staticPagesReadingSharedContent = (): string[] =>
  pageFiles(PAGES_DIR)
    .filter((file) => {
      const name = path.basename(file)
      if (name.startsWith("_") || file.includes("[")) return false
      const source = fs.readFileSync(file, "utf8")
      const readsSharedContent =
        source.includes("sharedGetStaticProps") || source.includes("fetchSharedPageProps")
      // A page rendered per request is never stale, so it needs no rebuild.
      return readsSharedContent && !source.includes("getServerSideProps")
    })
    .map(routeFor)
    .filter((route) => !NOT_REVALIDATED.includes(route))
    .sort()

describe("REVALIDATED_PATHS", () => {
  it("covers every statically generated page that reads the shared content", () => {
    expect([...REVALIDATED_PATHS].sort()).toEqual(staticPagesReadingSharedContent())
  })

  it("finds pages to check, so the comparison above cannot pass on an empty set", () => {
    expect(staticPagesReadingSharedContent().length).toBeGreaterThan(40)
  })

  // Listing detail paths are generated on demand, so there is no list of them to rebuild. That page
  // reads its own shorter window instead, which pageOverrideProps.test.ts pins.
  it("includes no listing detail path", () => {
    expect(REVALIDATED_PATHS.filter((route) => route.startsWith("/listing"))).toEqual([])
  })

  it("lists no path twice", () => {
    expect(new Set(REVALIDATED_PATHS).size).toEqual(REVALIDATED_PATHS.length)
  })
})
