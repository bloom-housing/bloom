import React from "react"
import { setupServer } from "msw/node"
import { screen, within } from "@testing-library/react"
import { FormProviderWrapper, mockNextRouter, render } from "../../../../testUtils"
import userEvent from "@testing-library/user-event"
import ApplicationTypes from "../../../../../src/components/listings/PaperListingForm/sections/ApplicationTypes"
import { jurisdiction, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  LanguagesEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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

describe("ApplicationTypes", () => {
  it("should render the base section component", () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={false}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Application types" })).toBeInTheDocument()
    expect(
      screen.getByText("Configure the online application and upload paper application forms.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("group", { name: "Is there a digital application?" })
    ).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Is there a paper application?" })).toBeInTheDocument()
    expect(
      screen.getByRole("group", { name: "Is there a referral opportunity?" })
    ).toBeInTheDocument()

    expect(screen.getAllByRole("radio", { name: /yes/i })).toHaveLength(3)
    expect(screen.getAllByRole("radio", { name: /no/i })).toHaveLength(3)
  })

  it("should update the referral question label when enableReferralQuestionUnits flag is turned on", () => {
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [],
            listings: [],
          },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) =>
            featureFlag === FeatureFlagEnum.enableReferralQuestionUnits,
          getJurisdictionLanguages: () => [],
        }}
      >
        <FormProviderWrapper>
          <ApplicationTypes
            disableCommonApplication={false}
            jurisdiction={jurisdiction.id}
            listing={listing}
            requiredFields={[]}
          />
        </FormProviderWrapper>
      </AuthContext.Provider>
    )

    expect(
      screen.getByRole("group", { name: "Are there units set aside for referral only?" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("group", { name: "Is there a referral opportunity?" })
    ).not.toBeInTheDocument()
  })

  it("should show add paper application button when paper application is enabled", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={false}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    const paperApplicationFieldset = screen.getByRole("group", {
      name: "Is there a paper application?",
    })
    expect(paperApplicationFieldset).toBeInTheDocument()

    const yesButton = within(paperApplicationFieldset).getByRole("radio", { name: /yes/i })
    expect(yesButton).toBeInTheDocument()
    await userEvent.click(yesButton)

    expect(await screen.findByRole("button", { name: "Add paper application" })).toBeInTheDocument()
  })

  it("should open drawer when add paper application button is clicked", async () => {
    render(
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            jurisdictions: [],
            listings: [],
          },
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) =>
            featureFlag === FeatureFlagEnum.enableReferralQuestionUnits,
          getJurisdictionLanguages: () => Object.values(LanguagesEnum),
        }}
      >
        <FormProviderWrapper>
          <ApplicationTypes
            disableCommonApplication={false}
            jurisdiction={jurisdiction.id}
            listing={listing}
            requiredFields={[]}
          />
        </FormProviderWrapper>
      </AuthContext.Provider>
    )

    const paperApplicationFieldset = screen.getByRole("group", {
      name: "Is there a paper application?",
    })
    expect(paperApplicationFieldset).toBeInTheDocument()

    const yesButton = within(paperApplicationFieldset).getByRole("radio", { name: /yes/i })
    expect(yesButton).toBeInTheDocument()
    await userEvent.click(yesButton)

    const addButton = await screen.findByRole("button", { name: "Add paper application" })
    expect(addButton).toBeInTheDocument()
    await userEvent.click(addButton)

    const addApplicationDialog = await screen.findByRole("dialog", {
      name: "Add paper application",
    })
    expect(addApplicationDialog).toBeInTheDocument()

    expect(
      within(addApplicationDialog).getByRole("option", { name: "Select language" })
    ).toBeInTheDocument()

    expect(
      within(addApplicationDialog).getByRole("option", { name: "English" })
    ).toBeInTheDocument()

    expect(
      within(addApplicationDialog).getByRole("option", { name: "Español" })
    ).toBeInTheDocument()

    expect(
      within(addApplicationDialog).getByRole("option", { name: "Tiếng Việt" })
    ).toBeInTheDocument()

    expect(within(addApplicationDialog).getByRole("option", { name: "中文" })).toBeInTheDocument()

    expect(
      within(addApplicationDialog).getByRole("option", { name: "Filipino" })
    ).toBeInTheDocument()

    expect(within(addApplicationDialog).getByRole("option", { name: "বাংলা" })).toBeInTheDocument()

    expect(within(addApplicationDialog).getByRole("option", { name: "عربى" })).toBeInTheDocument()

    await userEvent.selectOptions(within(addApplicationDialog).getByRole("combobox"), [
      LanguagesEnum.en,
    ])

    expect(await within(addApplicationDialog).findByText("Upload file")).toBeInTheDocument()
    expect(within(addApplicationDialog).getByText("Select PDF file")).toBeInTheDocument()
    expect(within(addApplicationDialog).getByText("Drag files here or")).toBeInTheDocument()
    expect(within(addApplicationDialog).getByText("choose from folder")).toBeInTheDocument()

    expect(within(addApplicationDialog).getByRole("button", { name: "Save" })).toBeInTheDocument()
    expect(within(addApplicationDialog).getByRole("button", { name: "Save" })).toBeDisabled()
    expect(within(addApplicationDialog).getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should handle referral opportunity checkbox toggle", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={false}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    const referralQuestionFieldset = screen.getByRole("group", {
      name: "Is there a referral opportunity?",
    })
    expect(referralQuestionFieldset).toBeInTheDocument()

    const referralYesRadio = within(referralQuestionFieldset).getByRole("radio", { name: /yes/i })
    await userEvent.click(referralYesRadio)
    expect(referralYesRadio).toBeChecked()

    expect(
      await screen.findByRole("textbox", { name: "Referral contact phone" })
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Referral contact phone" })).toHaveAttribute(
      "placeholder",
      "(555) 555-5555"
    )
    expect(screen.getByRole("textbox", { name: "Referral summary" })).toBeInTheDocument()
  })

  it("should apply phone mask to referral phone number", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={false}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    const referralQuestionFieldset = screen.getByRole("group", {
      name: "Is there a referral opportunity?",
    })
    expect(referralQuestionFieldset).toBeInTheDocument()

    const referralYesRadio = within(referralQuestionFieldset).getByRole("radio", { name: /yes/i })
    await userEvent.click(referralYesRadio)
    expect(referralYesRadio).toBeChecked()

    const phoneInput = await screen.findByRole("textbox", { name: "Referral contact phone" })
    await userEvent.type(phoneInput, "1234567890")
    expect(phoneInput).toHaveValue("(123) 456-7890")
  })

  it("should show common digital application option when enabled", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={false}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    const digitalApplicationFieldset = screen.getByRole("group", {
      name: "Is there a digital application?",
    })
    expect(digitalApplicationFieldset).toBeInTheDocument()

    const digitalApplicationYesRadio = within(digitalApplicationFieldset).getByRole("radio", {
      name: /yes/i,
    })
    await userEvent.click(digitalApplicationYesRadio)
    expect(digitalApplicationYesRadio).toBeChecked()

    const commonDigitalApplicationFieldset = await screen.findByRole("group", {
      name: "Are you using the common digital application?",
    })
    expect(commonDigitalApplicationFieldset).toBeInTheDocument()

    const commonDigitalApplicationNoRadio = within(commonDigitalApplicationFieldset).getByRole(
      "radio",
      { name: /no/i }
    )
    await userEvent.click(commonDigitalApplicationNoRadio)

    const customApplicationInput = await screen.findByRole("textbox", {
      name: "Custom online application URL",
    })
    expect(customApplicationInput).toBeInTheDocument()
    expect(customApplicationInput).toHaveAttribute("placeholder", "https://")
  })

  it("should disable common application option when disableCommonApplication is true", async () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes
          disableCommonApplication={true}
          jurisdiction={jurisdiction.id}
          listing={listing}
          requiredFields={[]}
        />
      </FormProviderWrapper>
    )

    const digitalApplicationFieldset = screen.getByRole("group", {
      name: "Is there a digital application?",
    })
    expect(digitalApplicationFieldset).toBeInTheDocument()

    const digitalApplicationYesRadio = within(digitalApplicationFieldset).getByRole("radio", {
      name: /yes/i,
    })
    await userEvent.click(digitalApplicationYesRadio)
    expect(digitalApplicationYesRadio).toBeChecked()

    expect(
      await screen.queryByRole("group", {
        name: "Are you using the common digital application?",
      })
    ).not.toBeInTheDocument()

    const customApplicationInput = await screen.findByRole("textbox", {
      name: "Custom online application URL",
    })
    expect(customApplicationInput).toBeInTheDocument()
    expect(customApplicationInput).toHaveAttribute("placeholder", "https://")
  })
})
