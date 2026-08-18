import * as hooks from "../../src/lib/hooks"
import { getStaticProps as faqProps } from "../../src/pages/faq"
import { getStaticProps as resourcesProps } from "../../src/pages/additional-resources"

describe("getStaticProps on the overridable pages", () => {
  const overrides = { en: { "a.key": "Override" } }

  beforeEach(() => {
    jest.restoreAllMocks()
    process.env.cacheRevalidate = "30"
    jest.spyOn(hooks, "fetchJurisdictionByName").mockResolvedValue({} as never)
    jest.spyOn(hooks, "fetchPublicOverrides").mockResolvedValue(overrides)
  })

  it.each([
    ["faq", faqProps],
    ["additional-resources", resourcesProps],
  ])("%s passes the overrides through and regenerates", async (_name, getProps) => {
    const result = await getProps({ locale: "es" })

    expect(hooks.fetchPublicOverrides).toHaveBeenCalledWith("es")
    expect(result.props.publicOverrides).toEqual(overrides)
    expect(result.revalidate).toEqual(30)
  })

  // The page must still build when the API is unreachable.
  it("still returns props when the overrides cannot be fetched", async () => {
    jest.spyOn(hooks, "fetchPublicOverrides").mockResolvedValue(null)

    const result = await faqProps({ locale: "en" })

    expect(result.props.publicOverrides).toBeNull()
    expect(result.props.jurisdiction).toBeDefined()
  })
})
