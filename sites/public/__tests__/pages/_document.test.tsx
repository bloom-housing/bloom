import Document from "next/document"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import BloomDocument, { brandStyleBlock } from "../../src/pages/_document"
import * as hooks from "../../src/lib/hooks"

const primary = {
  base: "#773E98",
  dark: "#6E2598",
  darker: "#4E2169",
  light: "#F2DAFF",
  lighter: "#F9F4FA",
}

const secondary = {
  base: "#1E7B8C",
  dark: "#186374",
  darker: "#0F4451",
  light: "#D6F0F5",
  lighter: "#EFFAFC",
}

const jurisdictionWith = (brand: unknown, flagOn = true) =>
  ({
    id: "jurisdiction-id",
    name: "Bloomington",
    brand,
    featureFlags: [{ name: FeatureFlagEnum.enableDbDrivenBranding, active: flagOn }],
  } as unknown as Jurisdiction)

const mockedFetch = jest.spyOn(hooks, "fetchJurisdictionByName")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = { req: { headers: {}, socket: {} } } as any

const styleFor = async (jurisdiction: Jurisdiction | null) => {
  mockedFetch.mockResolvedValue(jurisdiction)
  const props = await BloomDocument.getInitialProps(context)
  return brandStyleBlock(props)
}

describe("_document", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Document, "getInitialProps").mockResolvedValue({ html: "", head: [] } as never)
  })

  afterAll(() => mockedFetch.mockRestore())

  it("emits both namespaces for the primary ramp", async () => {
    const style = await styleFor(jurisdictionWith({ primary }))

    expect(style).toContain("--seeds-color-primary: #773E98;")
    expect(style).toContain("--seeds-color-primary-dark: #6E2598;")
    expect(style).toContain("--seeds-color-primary-darker: #4E2169;")
    expect(style).toContain("--seeds-color-primary-light: #F2DAFF;")
    expect(style).toContain("--seeds-color-primary-lighter: #F9F4FA;")
    expect(style).toContain("--bloom-color-primary: #773E98;")
    expect(style).toContain("--bloom-color-primary-lighter: #F9F4FA;")
    // Doubled so the block outranks the ui-seeds stylesheet that loads after it.
    expect(style.startsWith(":root:root {")).toBe(true)
  })

  it("emits the secondary ramp only when one is stored", async () => {
    expect(await styleFor(jurisdictionWith({ primary, secondary }))).toContain(
      "--seeds-color-secondary: #1E7B8C;"
    )
    expect(await styleFor(jurisdictionWith({ primary }))).not.toContain("--seeds-color-secondary")
  })

  it("emits nothing when the flag is off", async () => {
    expect(await styleFor(jurisdictionWith({ primary }, false))).toEqual("")
  })

  it("emits nothing when the jurisdiction has no brand", async () => {
    expect(await styleFor(jurisdictionWith(null))).toEqual("")
  })

  it("emits nothing when the jurisdiction cannot be read", async () => {
    expect(await styleFor(null)).toEqual("")
  })

  it("drops a stored value that is not hex", async () => {
    const injected = "red; } body { display: none } .x {"
    const style = await styleFor(jurisdictionWith({ primary: { ...primary, dark: injected } }))

    expect(style).toContain("--seeds-color-primary: #773E98;")
    expect(style).not.toContain("--seeds-color-primary-dark:")
    expect(style).not.toContain("display: none")
  })

  it("emits nothing when the base color is not hex", async () => {
    const style = await styleFor(
      jurisdictionWith({ primary: { ...primary, base: "rebeccapurple" } })
    )

    expect(style).toEqual("")
  })

  it("forwards the request so the API sees the visitor's address", async () => {
    await styleFor(jurisdictionWith({ primary }))

    expect(mockedFetch).toHaveBeenCalledWith(context.req)
  })
})
