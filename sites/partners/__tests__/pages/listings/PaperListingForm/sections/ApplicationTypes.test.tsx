import React from "react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"
import { FormProvider, useForm } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ApplicationTypes, {
  phoneMask,
} from "../../../../../src/components/listings/PaperListingForm/sections/ApplicationTypes"
import { mockNextRouter, render, screen, within, waitFor } from "../../../../testUtils"
import { FormProviderWrapper } from "../../../../components/applications/sections/helpers"
import * as assets from "../../../../../src/lib/assets"

jest.mock("../../../../../src/lib/assets", () => ({
  ...jest.requireActual("../../../../../src/lib/assets"),
  uploadAssetAndSetData: jest.fn(),
}))

beforeAll(() => {
  mockNextRouter()
})

const mockAuthContext = {
  doJurisdictionsHaveFeatureFlagOn: () => false,
  getJurisdictionLanguages: () => [LanguagesEnum.en, LanguagesEnum.es],
}

const listingWithJurisdiction = {
  ...listing,
  jurisdictions: { id: "nadahillId" },
}

const FormProviderWithJurisdiction = ({ children }: React.PropsWithChildren) => {
  const formMethods = useForm({
    defaultValues: {
      jurisdictions: { id: "nadahillId" },
    },
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

describe("ApplicationTypes", () => {
  it("should render application types section", () => {
    render(
      <FormProviderWrapper>
        <ApplicationTypes listing={listing} requiredFields={[]} />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: "Application types" })).toBeInTheDocument()
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
    await userEvent.click(within(referralApplication).getByRole("radio", { name: "Yes" }))

    const referralContactPhone = screen.getByRole("textbox", { name: "Referral contact phone" })
    expect(referralContactPhone).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Referral summary" })).toBeInTheDocument()

    // validate that the phone mask works
    await userEvent.type(referralContactPhone, "1234567890")
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
  describe("Add Application drawer", () => {
    it("should open and close the paper application drawer", async () => {
      render(
        <FormProviderWrapper>
          <ApplicationTypes listing={listing} requiredFields={[]} />
        </FormProviderWrapper>
      )

      const paperApplication = screen.getByRole("group", {
        name: "Is there a paper application?",
      })
      await userEvent.click(within(paperApplication).getByRole("radio", { name: "Yes" }))

      const addPaperAppButton = screen.getByRole("button", { name: "Add paper application" })
      expect(addPaperAppButton).toBeInTheDocument()

      await userEvent.click(addPaperAppButton)
      expect(screen.getByRole("heading", { name: "Add paper application" })).toBeInTheDocument()

      const cancelButton = screen.getByRole("button", { name: "Cancel" })
      await userEvent.click(cancelButton)
      expect(
        screen.queryByRole("heading", { name: "Add paper application" })
      ).not.toBeInTheDocument()
    })

    it("should disable save button and hide dropzone when no language is selected", async () => {
      render(
        <FormProviderWrapper>
          <ApplicationTypes listing={listing} requiredFields={[]} />
        </FormProviderWrapper>
      )

      const paperApplication = screen.getByRole("group", {
        name: "Is there a paper application?",
      })
      await userEvent.click(within(paperApplication).getByRole("radio", { name: "Yes" }))

      const addPaperAppButton = screen.getByRole("button", { name: "Add paper application" })
      await userEvent.click(addPaperAppButton)

      const saveButton = screen.getByRole("button", { name: "Save" })
      expect(saveButton).toBeDisabled()

      expect(screen.queryByText("Upload file")).not.toBeInTheDocument()
    })

    it("should show dropzone when a language is selected", async () => {
      render(
        <AuthContext.Provider value={mockAuthContext}>
          <FormProviderWithJurisdiction>
            <ApplicationTypes listing={listingWithJurisdiction} requiredFields={[]} />
          </FormProviderWithJurisdiction>
        </AuthContext.Provider>
      )

      const paperApplication = screen.getByRole("group", {
        name: "Is there a paper application?",
      })
      await userEvent.click(within(paperApplication).getByRole("radio", { name: "Yes" }))

      const addPaperAppButton = screen.getByRole("button", { name: "Add paper application" })
      await userEvent.click(addPaperAppButton)

      const languageSelect = screen.getByRole("combobox")
      await userEvent.selectOptions(languageSelect, "en")
      expect(screen.getByText("Upload file")).toBeInTheDocument()
    })

    it("should disable language selector and save button during file upload, then enable save after upload", async () => {
      const mockCloudinaryUploader = assets.uploadAssetAndSetData as jest.MockedFunction<
        typeof assets.uploadAssetAndSetData
      >
      mockCloudinaryUploader.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (_file, _label, setProgressValue, setAssetData) => {
          setProgressValue(100)
          setAssetData({
            id: "test-cloudinary-id/test-file",
            url: "https://test.cloudinary.com/test-file.pdf",
          })
        }
      )

      render(
        <AuthContext.Provider value={mockAuthContext}>
          <FormProviderWithJurisdiction>
            <ApplicationTypes listing={listingWithJurisdiction} requiredFields={[]} />
          </FormProviderWithJurisdiction>
        </AuthContext.Provider>
      )

      const paperApplication = screen.getByRole("group", {
        name: "Is there a paper application?",
      })
      await userEvent.click(within(paperApplication).getByRole("radio", { name: "Yes" }))

      const addPaperAppButton = screen.getByRole("button", { name: "Add paper application" })
      await userEvent.click(addPaperAppButton)

      const languageSelect = screen.getByRole("combobox")
      await userEvent.selectOptions(languageSelect, "en")

      await waitFor(() => {
        expect(screen.getByText("Upload file")).toBeInTheDocument()
      })

      const saveButton = screen.getByRole("button", { name: "Save" })
      expect(saveButton).toBeDisabled()

      const file = new File(["mocked application pdf content"], "application.pdf", {
        type: "application/pdf",
      })
      const dropzone = screen.getByLabelText("Upload file")

      await userEvent.upload(dropzone, file)

      await waitFor(() => {
        expect(languageSelect).toBeDisabled()
      })

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled()
      })

      await userEvent.click(saveButton)
      expect(
        screen.queryByRole("heading", { name: "Add paper application" })
      ).not.toBeInTheDocument()
    })
  })
})
