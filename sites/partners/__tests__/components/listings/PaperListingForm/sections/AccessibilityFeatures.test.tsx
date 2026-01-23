import React from "react"
import { setupServer } from "msw/lib/node"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import {
  defaultListingFeaturesConfiguration,
  expandedListingFeaturesConfiguration,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
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
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={[]}
          listingFeaturesConfiguration={null}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.queryByRole("heading", { level: 2, name: "Accessibility features" })
    ).not.toBeInTheDocument()
  })

  it("renders accessibility features list", () => {
    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={true}
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={["mobility", "visual"]}
          listingFeaturesConfiguration={defaultListingFeaturesConfiguration}
        />
      </FormProviderWrapper>
    )

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Accessibility features",
    })
    expect(heading).toBeInTheDocument()

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes).toHaveLength(defaultListingFeaturesConfiguration.fields.length)

    expect(
      screen.getByRole("checkbox", {
        name: "Units for those with mobility accessibility needs",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", {
        name: "Units for those with vision accessibility needs",
      })
    ).toBeInTheDocument()
  })

  it("renders accessibility features expanded detail summary with existing selections", () => {
    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={true}
          setAccessibilityFeatures={jest.fn()}
          existingFeatures={["wheelchairRamp", "hardFlooringInUnit"]}
          listingFeaturesConfiguration={expandedListingFeaturesConfiguration}
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

    expandedListingFeaturesConfiguration.categories.forEach((category) => {
      expect(screen.getByTestId(`accessibility-features-${category.id}`)).toBeInTheDocument()
    })
    expect(screen.getByText("Wheelchair ramp")).toBeInTheDocument()
    expect(screen.getByText("Hard flooring in unit")).toBeInTheDocument()
  })

  it("shows validation when saving expanded features without required flooring field and clears on entry", async () => {
    const setAccessibilityFeatures = jest.fn()

    render(
      <FormProviderWrapper>
        <AccessibilityFeatures
          enableAccessibilityFeatures={true}
          listingFeaturesConfiguration={expandedListingFeaturesConfiguration}
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
          enableAccessibilityFeatures={true}
          listingFeaturesConfiguration={expandedListingFeaturesConfiguration}
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
