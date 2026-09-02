import axios from "axios"
import * as hooks from "../../src/lib/hooks"

// The two listing pages fetch their listing directly rather than through lib/hooks.
jest.mock("axios")

// Every page with a data function has to pass the overrides through, or its strings silently stay
// on the bundled values. Listing them here rather than testing a sample keeps that honest.
const GENERATED = [
  "account/applications/closed/index",
  "account/applications/index",
  "account/applications/lottery/index",
  "account/applications/open/index",
  "account/dashboard",
  "account/favorites/index",
  "additional-resources",
  "faq",
  "finder",
  "get-assistance",
  "index",
  "listing/[id]/[slug]",
  "sign-in",
]

const PER_REQUEST = [
  "account/edit",
  "account/notifications",
  "complete-advocate-account",
  "create-advocate-account",
  "listings",
  "listings-closed",
  "preview/listings/[id]",
]

const overrides = { en: { "a.key": "Override" } }

const context = {
  req: { headers: {}, socket: {} },
  query: {},
  params: { id: "listing-id", slug: "a-slug" },
  locale: "es",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const load = (page: string): any => require(`../../src/pages/${page}`)

describe("pages pass the stored overrides through", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    process.env.cacheRevalidate = "30"
    jest.spyOn(hooks, "fetchJurisdictionByName").mockResolvedValue({} as never)
    jest.spyOn(hooks, "fetchPublicOverrides").mockResolvedValue(overrides)
    jest.spyOn(hooks, "fetchLimitedUnderConstructionListings").mockResolvedValue({} as never)
    jest.spyOn(hooks, "fetchOpenListings").mockResolvedValue({} as never)
    jest.spyOn(hooks, "fetchClosedListings").mockResolvedValue({} as never)
    jest.spyOn(hooks, "fetchMultiselectProgramData").mockResolvedValue([] as never)
    ;(axios.get as unknown as jest.Mock).mockResolvedValue({ data: {} })
  })

  it.each(GENERATED)("%s is generated with the overrides and a revalidate", async (page) => {
    const result = await load(page).getStaticProps(context)

    expect(result.props.publicOverrides).toEqual(overrides)
    expect(Number.isFinite(result.revalidate)).toBe(true)
  })

  it.each(PER_REQUEST)("%s is rendered per request with the overrides", async (page) => {
    const result = await load(page).getServerSideProps(context)

    expect(result.props.publicOverrides).toEqual(overrides)
    // Generated pages regenerate on a timer; these do not and must not claim to.
    expect(result).not.toHaveProperty("revalidate")
  })

  it.each(GENERATED)("%s asks for the rendered locale", async (page) => {
    await load(page).getStaticProps(context)

    // A generated page has no visitor request to forward, so it passes the locale alone.
    expect(hooks.fetchPublicOverrides).toHaveBeenCalledWith("es")
  })

  // The API rate-limits on the forwarded address, so a per-request page has to pass its request.
  it.each(PER_REQUEST)("%s forwards its request", async (page) => {
    await load(page).getServerSideProps(context)

    expect(hooks.fetchPublicOverrides).toHaveBeenCalledWith("es", context.req)
  })

  it("still returns props when the overrides cannot be fetched", async () => {
    jest.spyOn(hooks, "fetchPublicOverrides").mockResolvedValue(null)

    const result = await load("faq").getStaticProps(context)

    expect(result.props.publicOverrides).toBeNull()
  })
})
