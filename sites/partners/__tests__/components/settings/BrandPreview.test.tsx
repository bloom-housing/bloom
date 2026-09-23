import { previewVariables } from "../../../src/components/settings/BrandPreview"
import { brandToFormValues } from "../../../src/lib/branding"

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
    const variables = previewVariables(valuesWith({ primaryBase: "rebeccapurple" }))

    // The base is shown as given so the admin sees their own input; the shades cannot derive.
    expect(variables["--seeds-color-primary"]).toEqual("rebeccapurple")
    expect(variables["--seeds-color-primary-dark"]).toBeUndefined()
  })
})
