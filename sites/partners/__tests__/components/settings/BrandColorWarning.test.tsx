import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { addTranslation } from "@bloom-housing/ui-components"
import BrandColorWarning from "../../../src/components/settings/BrandColorWarning"
import { RampShade } from "../../../src/lib/branding"

// The suite supplies the strings it asserts on, so editing the shipped copy cannot break it.
addTranslation({
  "branding.contrastWarning": "test:white on %{field} at %{ratio}",
  "branding.contrastWarningBodyText": "test:body on %{field} at %{ratio}",
  "branding.lightnessWarning": "test:tooDark",
  "branding.contrastAction": "test:use %{suggestion}",
  "t.dismiss": "test:dismiss",
})

const renderWarning = (props: {
  value?: string
  shade?: RampShade | "base"
  derived?: string
  onApply?: (hex: string) => void
}) =>
  render(
    <BrandColorWarning
      value={props.value}
      shade={props.shade ?? "base"}
      fieldLabel="Base color"
      derived={props.derived}
      onApply={props.onApply ?? jest.fn()}
      testId="primaryBase"
    />
  )

// A value already present on mount is read straight away; only later edits settle first.
const findContrast = () => screen.findByTestId("primaryBase-contrast")
const findLightness = () => screen.findByTestId("primaryBase-lightness")

describe("BrandColorWarning", () => {
  describe("values it says nothing about", () => {
    it.each([undefined, "", "   ", "rebeccapurple", "#77", "#0077D"])(
      "renders nothing for %s",
      (value) => {
        const { container } = renderWarning({ value })

        expect(container).toBeEmptyDOMElement()
      }
    )

    it("renders nothing for a color that passes", () => {
      const { container } = renderWarning({ value: "#773E98" })

      expect(container).toBeEmptyDOMElement()
    })

    it("ignores whitespace around the value", async () => {
      renderWarning({ value: "  #EEDD00  " })

      expect(await findContrast()).toHaveTextContent("test:white on Base color at 1.4")
    })
  })

  describe("which text the color is read against", () => {
    it("reads a base against white", async () => {
      renderWarning({ value: "#EEDD00", shade: "base" })

      expect(await findContrast()).toHaveTextContent("test:white on Base color at 1.4")
    })

    it("reads a lighter shade against body text", async () => {
      renderWarning({ value: "#333333", shade: "lighter", derived: "#F8F4FB" })

      expect(await findContrast()).toHaveTextContent("test:body on Base color at 1.2")
    })
  })

  describe("the lightness floor", () => {
    it("warns on a base too dark for its shades to differ", async () => {
      renderWarning({ value: "#111111", shade: "base" })

      expect(await findLightness()).toBeInTheDocument()
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    })

    // The floor exists so the four derived shades stay distinct, which only the base decides.
    it("does not apply the floor to a shade", () => {
      const { container } = renderWarning({ value: "#111111", shade: "dark", derived: "#693786" })

      expect(container).toBeEmptyDOMElement()
    })

    it("offers no suggestion on the lightness warning", async () => {
      renderWarning({ value: "#111111", shade: "base" })
      await findLightness()

      expect(document.getElementById("primaryBase-apply")).toBeNull()
    })
  })

  describe("the suggestion", () => {
    it("offers a darker color for a failing base", async () => {
      const onApply = jest.fn()
      renderWarning({ value: "#EEDD00", shade: "base", onApply })
      await findContrast()

      await userEvent.click(screen.getByRole("button", { name: /test:use #807600/ }))
      expect(onApply).toHaveBeenCalledWith("#807600")
    })

    // Nudging lighter far enough to pass lands on a mid-tone, which would invert the ramp.
    it("offers the derived value for a failing shade", async () => {
      const onApply = jest.fn()
      renderWarning({ value: "#333333", shade: "lighter", derived: "#F8F4FB", onApply })
      await findContrast()

      await userEvent.click(screen.getByRole("button", { name: /test:use #F8F4FB/ }))
      expect(onApply).toHaveBeenCalledWith("#F8F4FB")
    })

    it("offers nothing when the derived value would fail too", async () => {
      renderWarning({ value: "#333333", shade: "lighter", derived: "#444444" })
      await findContrast()

      expect(document.getElementById("primaryBase-apply")).toBeNull()
    })
  })

  describe("dismissal", () => {
    it("hides a contrast warning", async () => {
      renderWarning({ value: "#EEDD00" })
      await findContrast()

      await userEvent.click(screen.getByRole("button", { name: "test:dismiss" }))
      expect(screen.queryByTestId("primaryBase-contrast")).not.toBeInTheDocument()
    })

    it("hides a lightness warning", async () => {
      renderWarning({ value: "#111111" })
      await findLightness()

      await userEvent.click(screen.getByRole("button", { name: "test:dismiss" }))
      expect(screen.queryByTestId("primaryBase-lightness")).not.toBeInTheDocument()
    })

    it("warns again on a different failing color", async () => {
      const { rerender } = renderWarning({ value: "#EEDD00" })
      await findContrast()
      await userEvent.click(screen.getByRole("button", { name: "test:dismiss" }))

      rerender(
        <BrandColorWarning
          value="#77AA33"
          shade="base"
          fieldLabel="Base color"
          onApply={jest.fn()}
          testId="primaryBase"
        />
      )

      expect(await findContrast()).toBeInTheDocument()
    })

    // Dismissal is held against the exact string, and the swatch writes uppercase, so the same
    // colour typed in lower case warns again.
    it("warns again when the same color comes back in a different case", async () => {
      const { rerender } = renderWarning({ value: "#eedd00" })
      await findContrast()
      await userEvent.click(screen.getByRole("button", { name: "test:dismiss" }))

      rerender(
        <BrandColorWarning
          value="#EEDD00"
          shade="base"
          fieldLabel="Base color"
          onApply={jest.fn()}
          testId="primaryBase"
        />
      )

      expect(await findContrast()).toBeInTheDocument()
    })
  })
})
