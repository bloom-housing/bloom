import React from "react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import ApplicationTypes, {
  phoneMask,
} from "../../../../../src/components/listings/PaperListingForm/sections/ApplicationTypes"
import { fireEvent, mockNextRouter, render, screen, within } from "../../../../testUtils"
import { FormProviderWrapper } from "../../../../components/applications/sections/helpers"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  mockNextRouter()
})

describe("ApplicationTypes", () => {
  it("should render application types section", () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes listing={listing} />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Application Types" })).toBeInTheDocument()
    const digitalApplication = screen.getByRole("row", {
      name: "Is there a digital application? Yes No Required to publish",
    })
    expect(
      within(digitalApplication).getByText("Is there a digital application?")
    ).toBeInTheDocument()
    expect(within(digitalApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    expect(within(digitalApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
    const paperApplication = screen.getByRole("row", {
      name: "Is there a paper application? Yes No Required to publish",
    })
    expect(within(paperApplication).getByText("Is there a paper application?")).toBeInTheDocument()
    expect(within(paperApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    expect(within(paperApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
    const referralApplication = screen.getByRole("row", {
      name: "Is there a referral opportunity? Yes No Required to publish",
    })
    expect(
      within(referralApplication).getByText("Is there a referral opportunity?")
    ).toBeInTheDocument()
    expect(within(referralApplication).getByRole("radio", { name: "No" })).toBeInTheDocument()
    expect(within(referralApplication).getByRole("radio", { name: "Yes" })).toBeInTheDocument()
  })

  it("should render referral opportunity section", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes listing={listing} />
      </FormProviderWrapper>
    )

    expect(screen.queryAllByRole("textbox", { name: "Referral Contact Phone" })).toHaveLength(0)
    expect(screen.queryAllByRole("textbox", { name: "Referral Summary" })).toHaveLength(0)
    const referralApplication = screen.getByRole("row", {
      name: "Is there a referral opportunity? Yes No Required to publish",
    })
    await userEvent.click(within(referralApplication).getByRole("radio", { name: "Yes" }))

    const referralContactPhone = screen.getByRole("textbox", { name: "Referral Contact Phone" })
    expect(referralContactPhone).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Referral Summary" })).toBeInTheDocument()

    // validate that the phone mask works
    await userEvent.type(referralContactPhone, "1234567890")
    expect(referralContactPhone).toHaveValue("(123) 456-7890")
  })

  describe("phoneMask", () => {
    it("should mask phone number and add proper character", () => {
      expect(phoneMask("1234567890", "")).toEqual("(123) 456-7890")
      expect(phoneMask("123", "")).toEqual("(123")
      expect(phoneMask("S", "")).toEqual("(")
      expect(phoneMask("(D", "")).toEqual("(")
      expect(phoneMask("1234", "")).toEqual("(123) 4")
      expect(phoneMask("12345678901234", "")).toEqual("(123) 456-7890")
      expect(phoneMask("(123) -45-67", "")).toEqual("(123) 456-7")
    })
  })
})
