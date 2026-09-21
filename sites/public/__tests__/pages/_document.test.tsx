import React from "react"
import { readFileSync } from "fs"
import { resolve } from "path"
import Document, { Head } from "next/document"
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

const propsFor = async (jurisdiction: Jurisdiction | null) => {
  mockedFetch.mockResolvedValue(jurisdiction)
  return await BloomDocument.getInitialProps(context)
}

const styleFor = async (jurisdiction: Jurisdiction | null) =>
  brandStyleBlock(await propsFor(jurisdiction))

// The document cannot be rendered in jsdom, so the returned element tree is walked instead.
const headChildrenFor = async (jurisdiction: Jurisdiction | null) => {
  const props = await propsFor(jurisdiction)
  const tree = new BloomDocument(props as never).render()
  const head = React.Children.toArray(tree.props.children).find(
    (child) => React.isValidElement(child) && child.type === Head
  ) as React.ReactElement

  return { props, children: React.Children.toArray(head.props.children) }
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

  it("drops a stored value that cannot be turned into a string", async () => {
    // JSON can hold this, and a regex test against it throws rather than returning false.
    const hostile = { toString: "not a function" }

    const style = await styleFor(jurisdictionWith({ primary: { ...primary, dark: hostile } }))

    expect(style).toContain("--seeds-color-primary: #773E98;")
    expect(style).not.toContain("--seeds-color-primary-dark:")
  })

  it("emits nothing when the base color cannot be turned into a string", async () => {
    const style = await styleFor(
      jurisdictionWith({ primary: { ...primary, base: { toString: "not a function" } } })
    )

    expect(style).toEqual("")
  })

  it("emits nothing when the base color is not hex", async () => {
    const style = await styleFor(
      jurisdictionWith({ primary: { ...primary, base: "rebeccapurple" } })
    )

    expect(style).toEqual("")
  })

  it("puts the style block in the document head", async () => {
    const { props, children } = await headChildrenFor(jurisdictionWith({ primary }))

    const style = children.find(
      (child) => React.isValidElement(child) && child.props.id === "brand-vars"
    ) as React.ReactElement

    expect(style.type).toEqual("style")
    expect(style.props.dangerouslySetInnerHTML.__html).toEqual(brandStyleBlock(props))
  })

  it("puts no style block in the head when there is no brand", async () => {
    const { children } = await headChildrenFor(jurisdictionWith(null))

    expect(
      children.some((child) => React.isValidElement(child) && child.props.id === "brand-vars")
    ).toBe(false)
  })

  it("drops the secondary ramp when its base is not hex, keeping the primary", async () => {
    const style = await styleFor(
      jurisdictionWith({ primary, secondary: { ...secondary, base: "teal" } })
    )

    expect(style).toContain("--seeds-color-primary: #773E98;")
    expect(style).not.toContain("--seeds-color-secondary")
  })

  it("drops only the bad shade of an otherwise valid secondary", async () => {
    const style = await styleFor(
      jurisdictionWith({ primary, secondary: { ...secondary, light: "papayawhip" } })
    )

    expect(style).toContain("--seeds-color-secondary: #1E7B8C;")
    expect(style).not.toContain("--seeds-color-secondary-light:")
  })

  it("emits nothing when a secondary is stored without a primary", async () => {
    expect(await styleFor(jurisdictionWith({ secondary }))).toEqual("")
  })

  it("accepts the three digit hex form", async () => {
    const style = await styleFor(jurisdictionWith({ primary: { base: "#ABC" } }))

    expect(style).toContain("--seeds-color-primary: #ABC;")
    expect(style).toContain("--bloom-color-primary: #ABC;")
  })

  it("links the favicon when one is stored", async () => {
    const { children } = await headChildrenFor(
      jurisdictionWith({ primary, faviconUrl: "https://example.test/favicon.png" })
    )

    const link = children.find(
      (child) => React.isValidElement(child) && child.props.rel === "icon"
    ) as React.ReactElement

    expect(link.props.href).toEqual("https://example.test/favicon.png")
  })

  it("links no favicon when none is stored, leaving /favicon.ico to apply", async () => {
    const { children } = await headChildrenFor(jurisdictionWith({ primary }))

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "icon")
    ).toBe(false)
  })

  it("links the favicon even when the colors are unusable", async () => {
    const { children } = await headChildrenFor(
      jurisdictionWith({
        primary: { base: "rebeccapurple" },
        faviconUrl: "https://example.test/favicon.png",
      })
    )

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "icon")
    ).toBe(true)
    expect(
      children.some((child) => React.isValidElement(child) && child.props.id === "brand-vars")
    ).toBe(false)
  })

  it("links no favicon when the flag is off", async () => {
    const { children } = await headChildrenFor(
      jurisdictionWith({ primary, faviconUrl: "https://example.test/favicon.png" }, false)
    )

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "icon")
    ).toBe(false)
  })

  it("preloads the font stylesheet before linking it", async () => {
    const fontUrl = "https://fonts.googleapis.com/css2?family=Inter&display=swap"
    const { children } = await headChildrenFor(
      jurisdictionWith({ primary, fontFamily: "Inter", fontUrl })
    )

    const fontLinks = children.filter(
      (child) => React.isValidElement(child) && child.props.href === fontUrl
    ) as React.ReactElement[]

    expect(fontLinks.map((link) => link.props.rel)).toEqual(["preload", "stylesheet"])
    expect(fontLinks[0].props.as).toEqual("style")
  })

  it("sets the font family with a fallback stack", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily: "Playfair Display",
        fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display",
      })
    )

    expect(style).toContain(
      `--seeds-font-sans: "Playfair Display", var(--brand-font-fallback-sans);`
    )
  })

  it("brands headings with the body font when no heading font is stored", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily: "Inter",
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )

    expect(style).toContain(`--seeds-font-sans: "Inter", var(--brand-font-fallback-sans);`)
    expect(style).toContain(`--seeds-font-alt-sans: "Inter", var(--brand-font-fallback-alt-sans);`)
  })

  it("uses a stored heading font for the alt token only", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily: "Inter",
        headingFontFamily: "Playfair Display",
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter&family=Playfair+Display",
      })
    )

    expect(style).toContain(`--seeds-font-sans: "Inter", var(--brand-font-fallback-sans);`)
    expect(style).toContain(
      `--seeds-font-alt-sans: "Playfair Display", var(--brand-font-fallback-alt-sans);`
    )
  })

  it("drops a heading font that could break out of the style block", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily: "Inter",
        headingFontFamily: `Inter"; } body { display: none } .x {`,
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )

    expect(style).not.toContain("display: none")
    expect(style).toContain(`--seeds-font-alt-sans: "Inter", var(--brand-font-fallback-alt-sans);`)
  })

  it("sets no font variable when the family has no stylesheet", async () => {
    const style = await styleFor(jurisdictionWith({ primary, fontFamily: "Inter" }))

    expect(style).not.toContain("--seeds-font-sans")
    expect(style).toContain("--seeds-color-primary: #773E98;")
  })

  it.each([
    ["a trailing space", "Inter "],
    ["a leading hyphen", "-Inter"],
    ["65 characters", "A".repeat(65)],
    ["a non-ascii character", "Söhne"],
  ])("drops a family name with %s", async (_label, fontFamily) => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily,
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )

    expect(style).not.toContain("--seeds-font-sans")
  })

  it("keeps a family name at the 64 character limit", async () => {
    const fontFamily = "A".repeat(64)
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily,
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )

    expect(style).toContain(`--seeds-font-sans: "${fontFamily}", var(--brand-font-fallback-sans);`)
  })

  it("gives the serif family its own fallback stack", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        serifFontFamily: "Noto Serif",
        fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif",
      })
    )

    expect(style).toContain(`--seeds-font-serif: "Noto Serif", var(--brand-font-fallback-serif);`)
  })

  it("sets no serif variable when the family has no stylesheet", async () => {
    const style = await styleFor(jurisdictionWith({ primary, serifFontFamily: "Noto Serif" }))

    expect(style).not.toContain("--seeds-font-serif")
  })

  it("emits the button radius as a brand variable", async () => {
    const style = await styleFor(jurisdictionWith({ primary, buttonRadius: "3xl" }))

    expect(style).toContain("--brand-button-radius: var(--seeds-rounded-3xl);")
    // The document names no ui-seeds selector; overrides.scss decides where the value applies.
    expect(style).not.toContain(".seeds-button")
  })

  it("names the unsuffixed seeds variable for the base step", async () => {
    const style = await styleFor(jurisdictionWith({ primary, buttonRadius: "base" }))

    expect(style).toContain("--brand-button-radius: var(--seeds-rounded);")
  })

  it.each([
    ["a step the scale does not define", "pill"],
    ["css that closes the declaration", "0; } body { display: none"],
    ["a var reference of its own", "var(--bloom-rounded)"],
  ])("drops %s", async (_label, buttonRadius) => {
    const style = await styleFor(jurisdictionWith({ primary, buttonRadius }))

    expect(style).toContain("--seeds-color-primary: #773E98;")
    expect(style).not.toContain("--brand-button-radius")
  })

  it("emits a radius-only brand", async () => {
    const style = await styleFor(jurisdictionWith({ buttonRadius: "full" }))

    expect(style).toBe(":root:root {\n--brand-button-radius: var(--seeds-rounded-full);\n}")
  })

  // The document and the stylesheet agree on a name that neither side can typecheck.
  it("emits only variables overrides.scss consumes", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        buttonRadius: "3xl",
        serifFontFamily: "Noto Serif",
        fontFamily: "Inter",
        headingFontFamily: "Lato",
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )
    const stylesheet = readFileSync(resolve(__dirname, "../../styles/overrides.scss"), "utf8")
    const declared = [...style.matchAll(/(--brand-[\w-]+):/g)].map(([, name]) => name)
    const referenced = [...style.matchAll(/var\((--brand-[\w-]+)\)/g)].map(([, name]) => name)

    expect(declared).toEqual(["--brand-button-radius"])
    expect(referenced.length).toBeGreaterThan(0)
    declared.forEach((name) => expect(stylesheet).toContain(`var(${name},`))
    referenced.forEach((name) => expect(stylesheet).toContain(`${name}:`))
  })

  it("links no font when none is stored", async () => {
    const { children } = await headChildrenFor(jurisdictionWith({ primary }))

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "stylesheet")
    ).toBe(false)
  })

  it("drops a font url that is not a google host", async () => {
    const { children } = await headChildrenFor(
      jurisdictionWith({
        primary,
        fontFamily: "Inter",
        fontUrl: "https://fonts.example.test/css2?family=Inter",
      })
    )

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "stylesheet")
    ).toBe(false)
  })

  it.each([
    ["a port", "https://fonts.googleapis.com:8080/css2?family=Inter"],
    ["credentials", "https://user:pass@fonts.googleapis.com/css2?family=Inter"],
  ])("drops a font url with %s", async (_label, fontUrl) => {
    const { children } = await headChildrenFor(
      jurisdictionWith({ primary, fontFamily: "Inter", fontUrl })
    )

    expect(
      children.some((child) => React.isValidElement(child) && child.props.rel === "stylesheet")
    ).toBe(false)
  })

  it("drops a family name that could break out of the style block", async () => {
    const style = await styleFor(
      jurisdictionWith({
        primary,
        fontFamily: `Inter"; } body { display: none } .x {`,
        fontUrl: "https://fonts.googleapis.com/css2?family=Inter",
      })
    )

    expect(style).not.toContain("display: none")
    expect(style).not.toContain("--seeds-font-sans")
    expect(style).toContain("--seeds-color-primary: #773E98;")
  })

  it("forwards the request so the API sees the visitor's address", async () => {
    await styleFor(jurisdictionWith({ primary }))

    expect(mockedFetch).toHaveBeenCalledWith(context.req)
  })
})
