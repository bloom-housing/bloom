import React from "react"
import { setupServer } from "msw/lib/node"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { listingFeatures, expandedAccessibilityFeatures } from "@bloom-housing/shared-helpers"
import AccessibilityFeatures from "../../../../../src/components/listings/PaperListingForm/sections/AccessibilityFeatures"
import { FormProviderWrapper, mockNextRouter } from "../../../../testUtils"

const server = setupServer()

// Enable API mocking before tests.
beforeAll(() => {
  server.listen()
  mockNextRouter()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe("AccessibilityFeatures", () => {
  it("returns null when both feature flags are disabled", () => {
    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={false}
          enableExpandedAccessibilityFeatures={false}
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={[]}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.queryByRole("heading", { level: 2, name: "Accessibility features" })
    ).not.toBeInTheDocument()
  })

  it("renders accessibility features list with existing selections", () => {
    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={true}
          enableExpandedAccessibilityFeatures={false}
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={["mobility", "visual"]}
        />
      </FormProviderWrapper>
    )

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Accessibility features",
    })
    expect(heading).toBeInTheDocument()

    const checkboxes = screen.getAllByRole("checkbox")
    const checkedValues = checkboxes
      .filter((box) => (box as HTMLInputElement).checked)
      .map((box) => (box as HTMLInputElement).value)

    expect(checkboxes).toHaveLength(listingFeatures.length)
    expect(checkedValues).toEqual(expect.arrayContaining(["mobility", "visual"]))
  })

  it("renders accessibility features expanded detail summary with existing selections", () => {
    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={false}
          enableExpandedAccessibilityFeatures={true}
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={["wheelchairRamp", "hardFlooringInUnit"]}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Accessibility features",
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { level: 3, name: "Accessibility features summary" })
    ).toBeInTheDocument()

    Object.keys(expandedAccessibilityFeatures).forEach((category) => {
      expect(screen.getByTestId(`accessibility-features-${category}`)).toBeInTheDocument()
    })
    expect(screen.getByText("Wheelchair ramp")).toBeInTheDocument()
    expect(screen.getByText("Hard flooring in unit")).toBeInTheDocument()
  })

  it("shows validation when saving expanded features without required flooring field and clear on entry", async () => {
    const setAccessibilityFeatures = jest.fn()

    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={false}
          enableExpandedAccessibilityFeatures={true}
          setAccessibilityFeatures={setAccessibilityFeatures}
          existingFeatures={[]}
        />
      </FormProviderWrapper>
    )

    await userEvent.click(screen.getByRole("button", { name: "Add features" }))
    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    const requiredFlooringSection = screen.getByTestId("accessibility-features-section-flooring")
    expect(within(requiredFlooringSection).getByText("This field is required")).toBeInTheDocument()
    expect(setAccessibilityFeatures).not.toHaveBeenCalled()

    await userEvent.click(screen.getByLabelText("Hard flooring in unit"))
    expect(
      within(requiredFlooringSection).queryByText("This field is required")
    ).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(setAccessibilityFeatures).toHaveBeenCalledWith(
      expect.arrayContaining(["hardFlooringInUnit"])
    )
    expect((setAccessibilityFeatures.mock.calls[0][0] as string[]).length).toBe(1)
  })

  it("saves expanded features as a flat list once required selections are made", async () => {
    const setAccessibilityFeatures = jest.fn()

    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={false}
          enableExpandedAccessibilityFeatures={true}
          setAccessibilityFeatures={setAccessibilityFeatures}
          existingFeatures={[]}
        />
      </FormProviderWrapper>
    )

    await userEvent.click(screen.getByRole("button", { name: "Add features" }))

    await userEvent.click(screen.getByLabelText("Wheelchair ramp"))
    await userEvent.click(screen.getByLabelText("Hard flooring in unit"))
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(setAccessibilityFeatures).toHaveBeenCalledWith(
      expect.arrayContaining(["wheelchairRamp", "hardFlooringInUnit"])
    )
    expect((setAccessibilityFeatures.mock.calls[0][0] as string[]).length).toBe(2)
  })
})
