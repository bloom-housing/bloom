import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { addTranslation } from "@bloom-housing/ui-components"
import BrandPreview, { previewVariables } from "../../../src/components/settings/BrandPreview"
import { brandToFormValues } from "../../../src/lib/branding"

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
addTranslation({
  "branding.preview": "test:preview",
  "branding.previewHeading": "test:previewHeading",
  "branding.previewBody": "test:previewBody",
  "branding.previewSerif": "test:previewSerif",
  "branding.previewNote": "test:previewNote",
  "branding.previewPrimaryAction": "test:primaryAction",
  "branding.previewSecondaryAction": "test:secondaryAction",
  "branding.previewTag": "test:tag",
})

const valuesWith = (overrides = {}) => ({ ...brandToFormValues(undefined), ...overrides })

describe("previewVariables", () => {
  it("writes the same variable names the document writes to :root", () => {
    const variables = previewVariables(valuesWith({ primaryBase: "#773E98" }))

    expect(variables["--seeds-color-primary"]).toEqual("#773E98")
    expect(variables["--seeds-color-primary-dark"]).toEqual("#693786")
    expect(variables["--seeds-color-primary-darker"]).toEqual("#4C2861")
    expect(variables["--seeds-color-primary-light"]).toEqual("#EFE6F5")
    expect(variables["--seeds-color-primary-lighter"]).toEqual("#F8F4FB")
  })

  it("previews a derived shade, so the sample matches what a save would render", () => {
    const derived = previewVariables(valuesWith({ primaryBase: "#773E98" }))
    const explicit = previewVariables(
      valuesWith({ primaryBase: "#773E98", primaryDark: "#6E2598" })
    )

    expect(derived["--seeds-color-primary-dark"]).toEqual("#693786")
    expect(explicit["--seeds-color-primary-dark"]).toEqual("#6E2598")
  })

  it("previews a secondary set on its own", () => {
    const variables = previewVariables(valuesWith({ secondaryBase: "#0077DA" }))

    expect(variables["--seeds-color-secondary"]).toEqual("#0077DA")
    expect(variables["--seeds-color-primary"]).toBeUndefined()
  })

  it("maps the radius step to the seeds variable", () => {
    expect(previewVariables(valuesWith({ buttonRadius: "3xl" }))["--brand-button-radius"]).toEqual(
      "var(--seeds-rounded-3xl)"
    )
    expect(previewVariables(valuesWith({ buttonRadius: "base" }))["--brand-button-radius"]).toEqual(
      "var(--seeds-rounded)"
    )
  })

  it("writes nothing for an empty form", () => {
    expect(previewVariables(valuesWith())).toEqual({})
  })

  it("writes nothing for a base that is not a hex color", () => {
    expect(previewVariables(valuesWith({ primaryBase: "rebeccapurple" }))).toEqual({})
  })

  // A partial value is a valid custom property but not a valid color, so the sample button would
  // resolve its background to unset and disappear.
  it.each(["#0", "#00", "#0077", "#0077D"])("writes nothing while %s is being typed", (partial) => {
    expect(previewVariables(valuesWith({ primaryBase: partial }))).toEqual({})
  })

  it("writes nothing for a shade that is not a hex color", () => {
    const variables = previewVariables(
      valuesWith({ primaryBase: "#773E98", primaryDark: "rebeccapurple" })
    )

    expect(variables["--seeds-color-primary"]).toEqual("#773E98")
    expect(variables["--seeds-color-primary-dark"]).toBeUndefined()
  })
})

describe("BrandPreview", () => {
  it("names every sample it renders, so a missing copy key is caught", () => {
    render(<BrandPreview values={valuesWith({ primaryBase: "#773E98" })} />)

    expect(screen.getByRole("heading", { name: "test:preview" })).toBeInTheDocument()
    expect(screen.getByText("test:previewNote")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "test:primaryAction" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "test:secondaryAction" })).toBeInTheDocument()
    expect(screen.getByText("test:tag")).toBeInTheDocument()
  })

  it("puts the variables on the sample container", () => {
    render(<BrandPreview values={valuesWith({ primaryBase: "#773E98", buttonRadius: "3xl" })} />)

    expect(screen.getByTestId("brand-preview")).toHaveStyle({
      "--seeds-color-primary": "#773E98",
      "--brand-button-radius": "var(--seeds-rounded-3xl)",
    })
  })

  // The sample buttons sit inside the settings form, so a missing type would submit it.
  it("renders sample buttons that cannot submit a form", () => {
    render(<BrandPreview values={valuesWith({ primaryBase: "#773E98" })} />)

    screen
      .getAllByRole("button")
      .forEach((button) => expect(button).toHaveAttribute("type", "button"))
  })
})

const GOOGLE_FONT = "https://fonts.googleapis.com/css2?family=Inter&display=swap"

describe("the font preview", () => {
  const brandFontLinks = () =>
    Array.from(document.head.querySelectorAll("link[data-brand-preview-font]"))

  afterEach(() => brandFontLinks().forEach((link) => link.remove()))

  describe("previewVariables", () => {
    it("names the same variables the document writes", () => {
      const variables = previewVariables(
        valuesWith({
          fontUrl: GOOGLE_FONT,
          fontFamily: "Inter",
          headingFontFamily: "Playfair Display",
          serifFontFamily: "Noto Serif",
        })
      )

      expect(variables["--seeds-font-sans"]).toEqual(
        '"Inter", var(--brand-font-fallback-sans, sans-serif)'
      )
      expect(variables["--seeds-font-alt-sans"]).toEqual(
        '"Playfair Display", var(--brand-font-fallback-alt-sans, sans-serif)'
      )
      expect(variables["--seeds-font-serif"]).toEqual(
        '"Noto Serif", var(--brand-font-fallback-serif, serif)'
      )
    })

    // Matches the document: headings fall back to the sans family when none is set for them.
    it("uses the sans family for headings when no heading family is set", () => {
      const variables = previewVariables(valuesWith({ fontUrl: GOOGLE_FONT, fontFamily: "Inter" }))

      expect(variables["--seeds-font-alt-sans"]).toEqual(
        '"Inter", var(--brand-font-fallback-alt-sans, sans-serif)'
      )
    })

    // Without the stylesheet the sample renders in the fallback and looks like the font applied.
    it("writes no family without a usable font url", () => {
      const variables = previewVariables(valuesWith({ fontFamily: "Inter" }))

      expect(variables["--seeds-font-sans"]).toBeUndefined()
    })

    it("writes no family the brand dto would reject", () => {
      const variables = previewVariables(
        valuesWith({ fontUrl: GOOGLE_FONT, fontFamily: "var(--x)" })
      )

      expect(variables["--seeds-font-sans"]).toBeUndefined()
    })
  })

  describe("loading the stylesheet", () => {
    it("links the font once the url settles", async () => {
      render(<BrandPreview values={valuesWith({ fontUrl: GOOGLE_FONT })} />)

      await waitFor(() => expect(brandFontLinks()).toHaveLength(1))
      expect(brandFontLinks()[0].getAttribute("href")).toEqual(GOOGLE_FONT)
    })

    // The url is typed, so a half-formed or arbitrary host must never be requested.
    it.each([
      "https://fonts.example.test/css2?family=Inter",
      "http://fonts.googleapis.com/css2?family=Inter",
      "https://fonts.googleapis.com:8080/css2?family=Inter",
      "https://fonts.goog",
      "",
    ])("links nothing for %s", async (fontUrl) => {
      render(<BrandPreview values={valuesWith({ fontUrl })} />)

      await new Promise((resolve) => setTimeout(resolve, 600))
      expect(brandFontLinks()).toHaveLength(0)
    })

    it("removes the link when the preview goes away", async () => {
      const { unmount } = render(<BrandPreview values={valuesWith({ fontUrl: GOOGLE_FONT })} />)
      await waitFor(() => expect(brandFontLinks()).toHaveLength(1))

      unmount()

      expect(brandFontLinks()).toHaveLength(0)
    })

    it("replaces the link rather than stacking them when the url changes", async () => {
      const { rerender } = render(<BrandPreview values={valuesWith({ fontUrl: GOOGLE_FONT })} />)
      await waitFor(() => expect(brandFontLinks()).toHaveLength(1))

      const other = "https://fonts.googleapis.com/css2?family=Lato"
      rerender(<BrandPreview values={valuesWith({ fontUrl: other })} />)

      await waitFor(() => expect(brandFontLinks()[0].getAttribute("href")).toEqual(other))
      expect(brandFontLinks()).toHaveLength(1)
    })
  })

  it("renders a heading, body and serif sample", () => {
    render(<BrandPreview values={valuesWith({ primaryBase: "#773E98" })} />)

    expect(screen.getByText("test:previewHeading")).toBeInTheDocument()
    expect(screen.getByText("test:previewBody")).toBeInTheDocument()
    expect(screen.getByText("test:previewSerif")).toBeInTheDocument()
  })
})
