import React from "react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"
import ApplicationTypes, {
  phoneMask,
} from "../../../../../src/components/listings/PaperListingForm/sections/ApplicationTypes"
import { act, mockNextRouter, render, screen, within } from "../../../../testUtils"
import { FormProviderWrapper } from "../../../../components/applications/sections/helpers"

beforeAll(() => {
  mockNextRouter()
})

describe("ApplicationTypes", () => {
  it("should render application types section", () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes listing={listing} requiredFields={[]} />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { name: "Application Types" })).toBeInTheDocument()
    const digitalApplication = screen.getByRole("group", {
      name: "Is there a digital application?",
    })
    expect(
      within(digitalApplication).getByText("Is there a digital application?")
    ).toBeInTheDocument()
    expect(within(digitalApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    expect(within(digitalApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
    const paperApplication = screen.getByRole("group", {
      name: "Is there a paper application?",
    })
    expect(within(paperApplication).getByText("Is there a paper application?")).toBeInTheDocument()
    expect(within(paperApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    expect(within(paperApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
    // Referral opportunity not setup in Doorway
    // const referralApplication = screen.getByRole("group", {
    //   name: "Is there a referral opportunity?",
    // })
    // expect(
    //   within(referralApplication).getByText("Is there a referral opportunity?")
    // ).toBeInTheDocument()
    // expect(within(referralApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    // expect(within(referralApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
  })

  // Referral opportunity not configured in doorway
  it.skip("should render referral opportunity section", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes listing={listing} requiredFields={[]} />
      </FormProviderWrapper>
    )

    expect(screen.queryAllByRole("textbox", { name: "Referral contact phone" })).toHaveLength(0)
    expect(screen.queryAllByRole("textbox", { name: "Referral summary" })).toHaveLength(0)
    const referralApplication = screen.getByRole("group", {
      name: "Is there a referral opportunity?",
    })
    await act(() =>
      userEvent.click(within(referralApplication).getByRole("radio", { name: "Yes" }))
    )

    const referralContactPhone = screen.getByRole("textbox", { name: "Referral contact phone" })
    expect(referralContactPhone).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Referral summary" })).toBeInTheDocument()

    // validate that the phone mask works
    await act(() => userEvent.type(referralContactPhone, "1234567890"))
    expect(referralContactPhone).toHaveValue("(123) 456-7890")
  })

  describe("phoneMask", () => {
    it("should mask phone number and add proper character", () => {
      expect(phoneMask("1234567890")).toEqual("(123) 456-7890")
      expect(phoneMask("123")).toEqual("(123")
      expect(phoneMask("S")).toEqual("(")
      expect(phoneMask("(D")).toEqual("(")
      expect(phoneMask("1234")).toEqual("(123) 4")
      expect(phoneMask("12345678901234")).toEqual("(123) 456-7890")
      expect(phoneMask("(123) -45-67")).toEqual("(123) 456-7")
      expect(phoneMask("(123) g-45-67")).toEqual("(123) 456-7")
    })
  })
})
