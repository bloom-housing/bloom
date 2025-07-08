import React from "react"
import RentalsFinder from "../../src/components/finder/RentalsFinder"
import { render, screen, mockNextRouter, waitFor, within } from "../testUtils"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

beforeAll(() => {
  mockNextRouter()
})

describe("<RentalsFinder>", () => {
  it("renders all page elements", () => {
    render(
      <RentalsFinder
        activeFeatureFlags={[
          FeatureFlagEnum.enableRegions,
          FeatureFlagEnum.enableAccessibilityFeatures,
        ]}
      />
    )

    // Check header content
    const finderHeaderTitle = screen.getByRole("heading", {
      name: /find listings for you/i,
      level: 1,
    })
    expect(finderHeaderTitle).toBeInTheDocument()

    const finderHeader = finderHeaderTitle.parentElement

    const [sectionOne, sectionTwo, sectionThree] = within(finderHeader).getAllByRole("listitem")
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-disabled")

    const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText(/of \d/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    // Check question content
    expect(
      screen.getByRole("heading", { name: /how many bedrooms do you need\?/i, level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/we'll use your selection to highlight possible rentals that match/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /studio/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /1 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /2 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /3 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /4 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /5 bedroom/i })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument()
  })

  describe("should hide toggle sections based on feature flags", () => {
    it("should hide regions section if not toggled on", async () => {
      render(<RentalsFinder activeFeatureFlags={[FeatureFlagEnum.enableAccessibilityFeatures]} />)

      const finderHeaderTitle = screen.getByRole("heading", {
        name: /find listings for you/i,
        level: 1,
      })

      // ----------- Section 1 - Housing Needs | Step 1 - Bedrooms -------------------
      expect(finderHeaderTitle).toBeInTheDocument()

      const finderHeader = finderHeaderTitle.parentElement

      const [sectionOne, sectionTwo, sectionThree] = within(finderHeader).getAllByRole("listitem")
      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).toHaveClass("is-active")
      expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-disabled")
      expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionThree).toHaveClass("is-disabled")

      const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
      expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText(/of 3/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("1")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", { name: /how many bedrooms do you need\?/i, level: 2 })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/we'll use your selection to highlight possible rentals that match/i)
      ).toBeInTheDocument()

      const nextButton = screen.getByRole("button", { name: /next/i })
      expect(nextButton).toBeInTheDocument()
      await act(() => userEvent.click(nextButton))

      // ----------- Section 1 - Housing Needs | Step Skipped - Region  -------------------
      expect(
        screen.queryByRole("heading", {
          name: /what areas would you like to live in\?/i,
          level: 2,
        })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole(
          /we will use your selections to find you rentals that may match your housing needs./i
        )
      ).not.toBeInTheDocument()

      // ----------- Section 1 - Housing Needs | Step 2 - Rent  -------------------
      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).toHaveClass("is-active")
      expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-disabled")
      expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionThree).toHaveClass("is-disabled")

      expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("1")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", { name: /how much rent can you afford to pay\?/i, level: 2 })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /we will use your selections to find you rentals that may match your housing needs./i
        )
      ).toBeInTheDocument()
    })

    it("should hide accessibility section if not toggled on", async () => {
      render(<RentalsFinder activeFeatureFlags={[FeatureFlagEnum.enableRegions]} />)

      const finderHeaderTitle = screen.getByRole("heading", {
        name: /find listings for you/i,
        level: 1,
      })
      expect(finderHeaderTitle).toBeInTheDocument()

      const finderHeader = finderHeaderTitle.parentElement
      const [sectionOne, sectionTwo] = within(finderHeader).getAllByRole("listitem")

      // ----------- Section 1 - Housing Needs | Step 1 - Bedrooms -------------------
      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).toHaveClass("is-active")
      expect(within(sectionTwo).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-disabled")

      const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
      expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText(/of 2/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("1")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", { name: /how many bedrooms do you need\?/i, level: 2 })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/we'll use your selection to highlight possible rentals that match/i)
      ).toBeInTheDocument()

      const nextButton = screen.getByRole("button", { name: /next/i })
      expect(nextButton).toBeInTheDocument()
      await act(() => userEvent.click(nextButton))

      // ----------- Section 1 - Housing Needs | Step 2 - Regions -------------------
      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).toHaveClass("is-active")
      expect(within(sectionTwo).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-disabled")

      expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("1")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", {
          name: /what areas would you like to live in\?/i,
          level: 2,
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /we will use your selections to find you rentals that may match your housing needs./i
        )
      ).toBeInTheDocument()
      await act(() => userEvent.click(nextButton))

      // ----------- Section 1 - Housing Needs | Step 3 - Rent -------------------
      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).toHaveClass("is-active")
      expect(within(sectionTwo).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-disabled")

      expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("1")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", { name: /how much rent can you afford to pay\?/i, level: 2 })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /we will use your selections to find you rentals that may match your housing needs./i
        )
      ).toBeInTheDocument()

      await act(() => userEvent.click(nextButton))

      // ----------- Section 2 - Accessibility | Step Skipped -------------------

      expect(
        screen.queryByRole("heading", {
          name: /do you or anyone in your household need any of the following accessibility features\?/i,
          level: 2,
        })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole(
          /accessibility features include many designed specifically for residents with disabilities as well as a number of other building and unit amenities./i
        )
      ).not.toBeInTheDocument()

      // ----------- Section 3 - Building Types | Step 1 - Community Types -------------------

      expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
      expect(sectionOne).not.toHaveClass("is-active")
      expect(sectionOne).not.toHaveClass("is-disabled")
      expect(within(sectionTwo).getByText(/building types/i)).toBeInTheDocument()
      expect(sectionTwo).toHaveClass("is-active")

      expect(within(stepHeader).getByText(/building types/i)).toBeInTheDocument()
      expect(within(stepHeader).getByText("2")).toBeInTheDocument()

      expect(
        screen.getByRole("heading", {
          name: /are you looking for one of the following rental types\?/i,
          level: 2,
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /some affordable housing rental properties are dedicated to specific populations, like seniors. We will use your selections to find you rentals that may match your housing needs./i
        )
      ).toBeInTheDocument()
    })
  })

  it("should update content on next button click", async () => {
    render(
      <RentalsFinder
        activeFeatureFlags={[
          FeatureFlagEnum.enableRegions,
          FeatureFlagEnum.enableAccessibilityFeatures,
        ]}
      />
    )

    const finderHeaderTitle = screen.getByRole("heading", {
      name: /find listings for you/i,
      level: 1,
    })
    expect(finderHeaderTitle).toBeInTheDocument()

    const finderHeader = finderHeaderTitle.parentElement
    const [sectionOne, sectionTwo, sectionThree] = within(finderHeader).getAllByRole("listitem")

    // ----------- Section 1 - Housing Needs | Step 1 - Bedrooms -------------------
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-disabled")

    const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText(/of \d/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()

    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    // ----------- Section 1 - Housing Needs | Step 2 - Regions -------------------
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-disabled")

    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: /what areas would you like to live in\?/i,
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /we will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /greater downtown/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /eastside/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /southwest/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /westside/i })).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    // ----------- Section 1 - Housing Needs | Step 3 - Rent -------------------
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-disabled")

    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { name: /how much rent can you afford to pay\?/i, level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /we will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
    const minRentInput = screen.getByRole("textbox", { name: /minimum rent/i })
    expect(minRentInput).toBeInTheDocument()
    expect(minRentInput).toHaveAttribute("placeholder", "No Minimum Rent")
    const maxRentInput = screen.getByRole("textbox", { name: /maximum rent/i })
    expect(maxRentInput).toBeInTheDocument()
    expect(maxRentInput).toHaveAttribute("placeholder", "No Maximum Rent")
    expect(
      screen.getByRole("checkbox", {
        name: /include rentals that accept section 8 housing choice vouchers/i,
      })
    ).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    // ----------- Section 2 - Accessibility | Step 1 - Listing Features -------------------
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).not.toHaveClass("is-active")
    expect(sectionOne).not.toHaveClass("is-disabled")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-active")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-disabled")

    expect(within(stepHeader).getByText(/accessibility/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("2")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: /do you or anyone in your household need any of the following accessibility features\?/i,
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /accessibility features include many designed specifically for residents with disabilities as well as a number of other building and unit amenities./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /wheelchair ramp/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /elevator/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /service animals allowed/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /accessible parking spots/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /parking on site/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /in-unit washer\/dryer/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /laundry in building/i })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /barrier-free \(no-step\) property/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /roll-in showers/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /grab bars in bathrooms/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /heating in unit/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /ac in unit/i })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /units for those with hearing disabilities/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /units for those with mobility disabilities/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /units for those with visual disabilities/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /barrier-free \(no-step\) unit entrances/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /lowered light switches/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /barrier-free bathrooms/i })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /wide unit doorways for wheelchairs/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /lowered cabinets and countertops/i })
    ).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    // ----------- Section 3 - Building Types | Step 1 - Community Types -------------------

    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).not.toHaveClass("is-active")
    expect(sectionOne).not.toHaveClass("is-disabled")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).not.toHaveClass("is-active")
    expect(sectionTwo).not.toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionThree).toHaveClass("is-active")

    expect(within(stepHeader).getByText(/building types/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("3")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: /are you looking for one of the following rental types\?/i,
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /some affordable housing rental properties are dedicated to specific populations, like seniors. We will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /rentals for residents with disabilities/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /rentals for Seniors 55\+/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /rentals for Seniors 62\+/i })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /supportive housing for the homeless/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /rentals for veterans/i })).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    // --------------------------- Disclaimer --------------------------------------
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).not.toHaveClass("is-active")
    expect(sectionOne).not.toHaveClass("is-disabled")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).not.toHaveClass("is-active")
    expect(sectionTwo).not.toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionTwo).not.toHaveClass("is-active")
    expect(sectionTwo).not.toHaveClass("is-disabled")

    expect(within(finderHeader).queryByRole("heading", { level: 2 })).not.toBeInTheDocument()

    const alertBox = screen.getByTestId("alert-box")
    expect(
      within(alertBox).getByText(
        "Disclaimer: The information in this personalized rental finder should be used for informational purposes only. Due to the changing nature of property information, the best way to see if you qualify for a property or if it has any availability is by contacting the property itself."
      )
    )

    const disclaimerList = screen.getByTestId("disclaimers-list")
    expect(disclaimerList).toBeInTheDocument()
    const disclaimerItems = within(disclaimerList).getAllByRole("listitem")
    expect(disclaimerItems).toHaveLength(5)

    const disclaimerPatterns = [
      /this website will show you regulated affordable rentals, meaning they are affordable because of governmental funding./i,
      /with this funding, these kinds of rentals often have restrictions about who can live in a property./i,
      /many buildings serve moderate- or lower-income households, so applicants cannot make more money than specific income limits./i,
      /some buildings are only reserved for seniors./i,
      /at these kinds of rentals, property management staff will help you determine your eligibility./i,
    ]

    disclaimerItems.forEach((item, index) => {
      const matchingPattern = disclaimerPatterns[index]
      expect(item).toHaveTextContent(matchingPattern)
    })

    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /finish/i })).toBeInTheDocument()
  })

  it("should persist selection when switching steps", async () => {
    render(
      <RentalsFinder
        activeFeatureFlags={[
          FeatureFlagEnum.enableRegions,
          FeatureFlagEnum.enableAccessibilityFeatures,
        ]}
      />
    )

    let studioCheckbox = screen.getByRole("checkbox", { name: /studio/i })
    let oneBdrmCheckbox = screen.getByRole("checkbox", { name: /1 bedroom/i })
    expect(studioCheckbox).toBeInTheDocument()
    expect(oneBdrmCheckbox).toBeInTheDocument()

    // should not be checked by defualt
    expect(studioCheckbox).not.toBeChecked()
    expect(oneBdrmCheckbox).not.toBeChecked()

    await act(async () => {
      await userEvent.click(studioCheckbox)
      await userEvent.click(oneBdrmCheckbox)
    })

    // should be checked aftert user interaction
    expect(studioCheckbox).toBeChecked()
    expect(oneBdrmCheckbox).toBeChecked()

    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeInTheDocument()

    await act(() => userEvent.click(nextButton))

    let eastsideCheckbox = screen.getByRole("checkbox", { name: /eastside/i })
    expect(eastsideCheckbox).toBeInTheDocument()
    expect(eastsideCheckbox).not.toBeChecked()

    await act(() => userEvent.click(eastsideCheckbox))
    expect(eastsideCheckbox).toBeChecked()

    const backButton = screen.getByRole("button", { name: /back/i })
    expect(backButton).toBeInTheDocument()

    await act(() => userEvent.click(backButton))

    studioCheckbox = screen.getByRole("checkbox", { name: /studio/i })
    oneBdrmCheckbox = screen.getByRole("checkbox", { name: /1 bedroom/i })
    expect(studioCheckbox).toBeInTheDocument()
    expect(oneBdrmCheckbox).toBeInTheDocument()
    expect(studioCheckbox).toBeChecked()
    expect(oneBdrmCheckbox).toBeChecked()

    await act(() => userEvent.click(nextButton))

    eastsideCheckbox = screen.getByRole("checkbox", { name: /eastside/i })
    expect(eastsideCheckbox).toBeInTheDocument()
    expect(eastsideCheckbox).toBeChecked()
  })

  it("should skip to disclaimer on skip button click", async () => {
    render(
      <RentalsFinder
        activeFeatureFlags={[
          FeatureFlagEnum.enableRegions,
          FeatureFlagEnum.enableAccessibilityFeatures,
        ]}
      />
    )

    const skipButton = screen.getByRole("button", { name: /skip this and show me listings/i })
    expect(skipButton).toBeInTheDocument()

    await act(() => userEvent.click(skipButton))

    const finderHeaderTitle = screen.getByRole("heading", {
      name: /find listings for you/i,
      level: 1,
    })
    expect(finderHeaderTitle).toBeInTheDocument()

    const finderHeader = finderHeaderTitle.parentElement
    const [sectionOne, sectionTwo, sectionThree] = within(finderHeader).getAllByRole("listitem")

    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).not.toHaveClass("is-active")
    expect(sectionOne).not.toHaveClass("is-disabled")
    expect(within(sectionTwo).getByText(/accessibility/i)).toBeInTheDocument()
    expect(sectionTwo).not.toHaveClass("is-active")
    expect(sectionTwo).not.toHaveClass("is-disabled")
    expect(within(sectionThree).getByText(/building types/i)).toBeInTheDocument()
    expect(sectionTwo).not.toHaveClass("is-active")
    expect(sectionTwo).not.toHaveClass("is-disabled")

    expect(within(finderHeader).queryByRole("heading", { level: 2 })).not.toBeInTheDocument()

    const alertBox = screen.getByTestId("alert-box")
    expect(
      within(alertBox).getByText(
        "Disclaimer: The information in this personalized rental finder should be used for informational purposes only. Due to the changing nature of property information, the best way to see if you qualify for a property or if it has any availability is by contacting the property itself."
      )
    )

    const disclaimerList = screen.getByTestId("disclaimers-list")
    expect(disclaimerList).toBeInTheDocument()
    const disclaimerItems = within(disclaimerList).getAllByRole("listitem")
    expect(disclaimerItems).toHaveLength(5)

    const disclaimerPatterns = [
      /this website will show you regulated affordable rentals, meaning they are affordable because of governmental funding./i,
      /with this funding, these kinds of rentals often have restrictions about who can live in a property./i,
      /many buildings serve moderate- or lower-income households, so applicants cannot make more money than specific income limits./i,
      /some buildings are only reserved for seniors./i,
      /at these kinds of rentals, property management staff will help you determine your eligibility./i,
    ]

    disclaimerItems.forEach((item, index) => {
      const matchingPattern = disclaimerPatterns[index]
      expect(item).toHaveTextContent(matchingPattern)
    })
  })

  describe("should navigate with filter querry", () => {
    it("should nagvigate withouth query params when no option selected", async () => {
      const { pushMock } = mockNextRouter()
      render(
        <RentalsFinder
          activeFeatureFlags={[
            FeatureFlagEnum.enableRegions,
            FeatureFlagEnum.enableAccessibilityFeatures,
          ]}
        />
      )

      while (!screen.queryByRole("button", { name: /finish/i })) {
        const nextButton = screen.getByRole("button", { name: /next/i })
        await act(() => userEvent.click(nextButton))
      }

      const finishButton = screen.getByRole("button", { name: /finish/i })
      expect(finishButton).toBeInTheDocument()

      await act(() => userEvent.click(finishButton))

      await waitFor(() => {
        expect(pushMock).toBeCalledWith("/listings")
      })
    })

    it("should navigate with formatted query params", async () => {
      const { pushMock } = mockNextRouter()

      render(
        <RentalsFinder
          activeFeatureFlags={[
            FeatureFlagEnum.enableRegions,
            FeatureFlagEnum.enableAccessibilityFeatures,
          ]}
        />
      )

      // ----------- Section 1 - Housing Needs | Step 1 - Bedrooms -------------------

      const studioCheckbox = screen.getByRole("checkbox", { name: /studio/i })
      const oneBdrmCheckbox = screen.getByRole("checkbox", { name: /1 bedroom/i })
      expect(studioCheckbox).toBeInTheDocument()
      expect(oneBdrmCheckbox).toBeInTheDocument()

      await act(async () => {
        await userEvent.click(studioCheckbox)
        await userEvent.click(oneBdrmCheckbox)
      })

      const nextButton = screen.getByRole("button", { name: /next/i })
      expect(nextButton).toBeInTheDocument()
      await act(() => userEvent.click(nextButton))

      // ----------- Section 1 - Housing Needs | Step 2 - Regions -------------------

      const greaterDowntownCheckbox = screen.getByRole("checkbox", { name: /greater downtown/i })
      const westsideCheckbox = screen.getByRole("checkbox", { name: /westside/i })
      expect(greaterDowntownCheckbox).toBeInTheDocument()
      expect(westsideCheckbox).toBeInTheDocument()

      await act(async () => {
        await userEvent.click(greaterDowntownCheckbox)
        await userEvent.click(westsideCheckbox)
        await userEvent.click(nextButton)
      })

      // ----------- Section 1 - Housing Needs | Step 3 - Rent -------------------

      const minRentInput = screen.getByRole("textbox", { name: /minimum rent/i })
      const maxRentInput = screen.getByRole("textbox", { name: /maximum rent/i })
      const section8Button = screen.getByRole("checkbox", {
        name: /include rentals that accept section 8 housing choice vouchers/i,
      })

      expect(minRentInput).toBeInTheDocument()
      expect(maxRentInput).toBeInTheDocument()
      expect(section8Button).toBeInTheDocument()

      await act(async () => {
        await userEvent.type(minRentInput, "1500")
        await userEvent.type(maxRentInput, "3000")
        await userEvent.click(section8Button)
        await userEvent.click(nextButton)
      })

      // ----------- Section 2 - Accessibility | Step 1 - Listing Features -------------------
      const wheelchairCheckbox = screen.getByRole("checkbox", { name: /wheelchair ramp/i })
      const elevatorCheckbox = screen.getByRole("checkbox", { name: /elevator/i })
      const animalCheckbox = screen.getByRole("checkbox", { name: /service animals allowed/i })

      expect(wheelchairCheckbox).toBeInTheDocument()
      expect(elevatorCheckbox).toBeInTheDocument()
      expect(animalCheckbox).toBeInTheDocument()

      await act(async () => {
        await userEvent.click(wheelchairCheckbox)
        await userEvent.click(elevatorCheckbox)
        await userEvent.click(animalCheckbox)
        await userEvent.click(nextButton)
      })

      // ----------- Section 3 - Building Types | Step 1 - Community Types -------------------
      const veteranCheckbox = screen.getByRole("checkbox", { name: /rentals for veterans/i })
      expect(veteranCheckbox).toBeInTheDocument()

      await act(async () => {
        await userEvent.click(veteranCheckbox)
        await userEvent.click(nextButton)
      })

      // --------------------------- Disclaimer --------------------------------------
      const finishButton = screen.getByRole("button", { name: /finish/i })
      expect(finishButton).toBeInTheDocument()

      await act(() => userEvent.click(finishButton))

      await waitFor(() => {
        expect(pushMock).toBeCalledWith(
          "/listings?bedroomTypes=studio,oneBdrm&regions=Greater_Downtown,Westside&monthlyRent=1,500.00-3,000.00&section8Acceptance=true&listingFeatures=wheelchairRamp,elevator,serviceAnimalsAllowed&reservedCommunityTypes=veterans"
        )
      })
    })
  })
})
