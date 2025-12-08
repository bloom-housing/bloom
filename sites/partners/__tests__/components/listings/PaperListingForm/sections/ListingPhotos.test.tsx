import React from "react"
import { expect } from "@jest/globals"
import "@testing-library/jest-dom"
import { FormProvider, useForm } from "react-hook-form"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import { setupServer } from "msw/lib/node"
import { mockNextRouter } from "../../../../testUtils"
import { render, screen, within } from "@testing-library/react"
import ListingPhotos from "../../../../../src/components/listings/PaperListingForm/sections/ListingPhotos"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import * as helpers from "../../../../../src/lib/helpers"

jest.mock("../../../../../src/lib/helpers", () => ({
  ...jest.requireActual("../../../../../src/lib/helpers"),
  cloudinaryFileUploader: jest.fn(),
}))

const FormComponent = ({ children, values }: { values?: FormListing; children }) => {
  const formMethods = useForm<FormListing>({
    defaultValues: { ...formDefaults, ...values },
    shouldUnregister: false,
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

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

describe("<ListingPhotos>", () => {
  describe("enableListingImageAltText feature flag", () => {
    const listingImages = [
      {
        assets: {
          createdAt: new Date(),
          updatedAt: new Date(),
          fileId: "file_1_id",
          id: "asset_1_id",
          label: "Asset 1 Label",
        },
        ordinal: 0,
        description: "Front view of the building",
      },
      {
        assets: {
          createdAt: new Date(),
          updatedAt: new Date(),
          fileId: "file_2_id",
          id: "asset_2_id",
          label: "Asset 2 Label",
        },
        ordinal: 1,
        description: "Lobby interior view",
      },
    ]

    it("shows description column and hides delete buttons when enabled", () => {
      const doJurisdictionsHaveFeatureFlagOn = jest.fn(() => true)
      render(
        <AuthContext.Provider value={{ doJurisdictionsHaveFeatureFlagOn }}>
          <FormComponent
            values={{
              ...formDefaults,
              ...listing,
              jurisdictions: { id: "jurisdiction-id" },
              listingImages,
            }}
          >
            <ListingPhotos requiredFields={["listingImages"]} />
          </FormComponent>
        </AuthContext.Provider>
      )

      expect(doJurisdictionsHaveFeatureFlagOn).toHaveBeenCalledWith(
        FeatureFlagEnum.enableListingImageAltText,
        "jurisdiction-id"
      )

      const imagesTable = screen.getByRole("table")
      const [head, body] = within(imagesTable).getAllByRole("rowgroup")

      const headerTexts = within(head)
        .getAllByRole("columnheader")
        .map((col) => col.textContent)
      expect(headerTexts).toEqual(["Preview", "Image description", "Actions"])

      const rows = within(body).getAllByRole("row")
      const [firstPreview, firstDescription] = within(rows[0]).getAllByRole("cell")
      expect(within(firstPreview).getByRole("img")).toHaveAttribute("src", "file_1_id")
      expect(firstDescription).toHaveTextContent("Front view of the building")

      expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
    })

    it("opens alt text editor from drawer when enabled", async () => {
      const doJurisdictionsHaveFeatureFlagOn = jest.fn(() => true)
      render(
        <AuthContext.Provider value={{ doJurisdictionsHaveFeatureFlagOn }}>
          <FormComponent
            values={{
              ...formDefaults,
              ...listing,
              jurisdictions: { id: "jurisdiction-id" },
              listingImages,
            }}
          >
            <ListingPhotos requiredFields={["listingImages"]} />
          </FormComponent>
        </AuthContext.Provider>
      )

      const editPhotosButton = screen.getByRole("button", { name: "Edit photos" })
      await userEvent.click(editPhotosButton)

      const drawer = await screen.findByRole("dialog", { name: "Edit photos" })
      expect(within(drawer).getByTestId("drawer-photos-table")).toBeInTheDocument()

      const editButtons = within(drawer).getAllByRole("button", { name: "Edit" })
      expect(editButtons).toHaveLength(2)

      await userEvent.click(editButtons[0])

      const altTextDrawer = await screen.findByRole("dialog", { name: "Add image description" })
      expect(
        within(altTextDrawer).getByLabelText("Image description (alt text)")
      ).toBeInTheDocument()
      expect(within(altTextDrawer).getByRole("button", { name: "Save" })).toBeInTheDocument()
    })

    it("opens alt text drawer after uploading a new photo when enabled", async () => {
      const mockCloudinaryUploader = helpers.cloudinaryFileUploader as jest.MockedFunction<
        typeof helpers.cloudinaryFileUploader
      >
      mockCloudinaryUploader.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/require-await
        async ({ setCloudinaryData, setProgressValue }) => {
          setProgressValue(100)
          setCloudinaryData({ id: "new-file-id", url: "http://example.com/new-file" })
        }
      )

      render(
        <AuthContext.Provider value={{ doJurisdictionsHaveFeatureFlagOn: () => true }}>
          <FormComponent
            values={{
              ...formDefaults,
              ...listing,
              jurisdictions: { id: "jurisdiction-id" },
              listingImages: [],
            }}
          >
            <ListingPhotos requiredFields={["listingImages"]} />
          </FormComponent>
        </AuthContext.Provider>
      )

      const addPhotosButton = screen.getByRole("button", { name: "Add photo" })
      await userEvent.click(addPhotosButton)

      const addPhotosDrawer = await screen.findByRole("dialog", { name: "Add photo" })
      const dropzoneInput = within(addPhotosDrawer).getByTestId("dropzone-input")

      const newFile = new File(["dummy file"], "new-photo.jpg", { type: "image/jpeg" })
      await userEvent.upload(dropzoneInput, newFile)

      const altTextDrawer = await screen.findByRole("dialog", { name: "Add image description" })
      expect(
        within(altTextDrawer).getByLabelText("Image description (alt text)")
      ).toBeInTheDocument()
    })
  })
})
