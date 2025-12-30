import React from "react"
import "@testing-library/jest-dom"
import { FormProvider, useForm } from "react-hook-form"
import { render, screen, within } from "@testing-library/react"
import { jurisdiction, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { setupServer } from "msw/lib/node"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import ListingPhotos from "../../../../../src/components/listings/PaperListingForm/sections/ListingPhotos"
import { mockNextRouter } from "../../../../testUtils"
import userEvent from "@testing-library/user-event"
import * as helpers from "../../../../../src/lib/helpers"

jest.mock("../../../../../src/lib/helpers", () => {
  const actual = jest.requireActual<typeof helpers>("../../../../../src/lib/helpers")
  return {
    ...actual,
    cloudinaryFileUploader: jest.fn(),
  }
})

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
  describe("should render empty section when data is missing", () => {
    it("listing images are not required", () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={[]}
            jurisdiction={jurisdiction}
          />
        </FormComponent>
      )

      expect(screen.getByRole("heading", { level: 2, name: "Listing photos" })).toBeInTheDocument()
      expect(
        screen.getByText("Upload an image for the listing that will be used as a preview.")
      ).toBeInTheDocument()
      expect(screen.getByText("Photos")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Add photos" })).toBeInTheDocument()

      expect(screen.queryByRole("button", { name: "Edit photos" })).not.toBeInTheDocument()
      expect(screen.queryByRole("table")).not.toBeInTheDocument()
    })

    it("at least one image is required", () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 1 }}
          />
        </FormComponent>
      )

      expect(screen.getByRole("heading", { level: 2, name: "Listing photos" })).toBeInTheDocument()
      expect(
        screen.getByText("Upload at least 1 image for the listing that will be used as a preview.")
      ).toBeInTheDocument()
      expect(screen.getByText("Photos")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Add photos" })).toBeInTheDocument()

      expect(screen.queryByRole("button", { name: "Edit photos" })).not.toBeInTheDocument()
      expect(screen.queryByRole("table")).not.toBeInTheDocument()
    })

    it("more than one image is required", () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 3 }}
          />
        </FormComponent>
      )

      expect(screen.getByRole("heading", { level: 2, name: "Listing photos" })).toBeInTheDocument()
      expect(
        screen.getByText("Upload at least 3 images for the listing that will be used as a preview.")
      ).toBeInTheDocument()
      expect(screen.getByText("Photos")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Add photos" })).toBeInTheDocument()

      expect(screen.queryByRole("button", { name: "Edit photos" })).not.toBeInTheDocument()
      expect(screen.queryByRole("table")).not.toBeInTheDocument()
    })

    it("update button label when images have already been added", () => {
      render(
        <FormComponent
          values={{
            ...listing,
            listingImages: [
              {
                assets: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fileId: "file_1_id",
                  id: "asset_1_id",
                  label: "Asset 1 Label",
                },
                ordinal: 1,
              },
              {
                assets: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fileId: "file_2_id",
                  id: "asset_2_id",
                  label: "Asset 2 Label",
                },
                ordinal: 2,
              },
            ],
          }}
        >
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 3 }}
          />
        </FormComponent>
      )

      const imagesTable = screen.getByRole("table")
      expect(imagesTable).toBeInTheDocument()

      const [head, body] = within(imagesTable).getAllByRole("rowgroup")

      const headerColumns = within(head).getAllByRole("columnheader")
      expect(headerColumns).toHaveLength(2)
      const [previewHeader, actionsHeader] = headerColumns
      expect(previewHeader).toHaveTextContent("Preview")
      expect(actionsHeader).not.toHaveTextContent()

      const rows = within(body).getAllByRole("row")
      expect(rows).toHaveLength(2)

      const [firstPreview, firstActions] = within(rows[0]).getAllByRole("cell")
      expect(within(firstPreview).getByRole("presentation")).toBeInTheDocument()
      expect(within(firstPreview).getByRole("presentation")).toHaveAttribute("src", "file_1_id")
      expect(within(firstActions).getByRole("button", { name: "Delete" })).toBeInTheDocument()

      const [secondPreview, secondActions] = within(rows[1]).getAllByRole("cell")
      expect(within(secondPreview).getByRole("presentation")).toBeInTheDocument()
      expect(within(secondPreview).getByRole("presentation")).toHaveAttribute("src", "file_2_id")
      expect(within(secondActions).getByRole("button", { name: "Delete" })).toBeInTheDocument()

      expect(screen.queryByRole("button", { name: "Add photos" })).not.toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Edit photos" })).toBeInTheDocument()
    })
  })

  describe("should open images drawer on Add Button click", () => {
    it("should render table with proper description when images are not required", async () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={[]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 3 }}
          />
        </FormComponent>
      )

      const addButton = screen.getByRole("button", { name: "Add photos" })
      expect(addButton).toBeInTheDocument()

      await userEvent.click(addButton)

      const dialogDrawer = await screen.findByRole("dialog", { name: "Add photos" })
      expect(dialogDrawer).toBeInTheDocument()

      expect(
        within(dialogDrawer).getByRole("heading", { level: 2, name: "Listing photos" })
      ).toBeInTheDocument()
      expect(
        within(dialogDrawer).getByText(
          "Select JPEG or PNG file to upload. Please upload horizontal images only at approximately 1440px. Up to 10 uploaded images allowed."
        )
      ).toBeInTheDocument()

      expect(within(dialogDrawer).getByRole("button", { name: "Save" })).toBeInTheDocument()
    })

    it("should render table with proper description when one image is required", async () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 1 }}
          />
        </FormComponent>
      )

      const addButton = screen.getByRole("button", { name: "Add photos" })
      expect(addButton).toBeInTheDocument()

      await userEvent.click(addButton)

      const dialogDrawer = await screen.findByRole("dialog", { name: "Add photos" })
      expect(dialogDrawer).toBeInTheDocument()

      expect(
        within(dialogDrawer).getByRole("heading", { level: 2, name: "Listing photos" })
      ).toBeInTheDocument()
      expect(
        within(dialogDrawer).getByText(
          "Select JPEG or PNG file to upload. Please upload horizontal images only at approximately 1440px. At least 1 image is required, and up to 10 images are allowed."
        )
      ).toBeInTheDocument()

      expect(within(dialogDrawer).getByRole("button", { name: "Save" })).toBeInTheDocument()
    })

    it("should render table with proper description when more than one images is required", async () => {
      render(
        <FormComponent>
          <ListingPhotos
            enableListingImageAltText={false}
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 3 }}
          />
        </FormComponent>
      )

      const addButton = screen.getByRole("button", { name: "Add photos" })
      expect(addButton).toBeInTheDocument()

      await userEvent.click(addButton)

      const dialogDrawer = await screen.findByRole("dialog", { name: "Add photos" })
      expect(dialogDrawer).toBeInTheDocument()

      expect(
        within(dialogDrawer).getByRole("heading", { level: 2, name: "Listing photos" })
      ).toBeInTheDocument()
      expect(
        within(dialogDrawer).getByText(
          "Select JPEG or PNG file to upload. Please upload horizontal images only at approximately 1440px. At least 3 images are required, and up to 10 images are allowed."
        )
      ).toBeInTheDocument()

      expect(within(dialogDrawer).getByRole("button", { name: "Save" })).toBeInTheDocument()
    })
  })
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
      render(
        <FormComponent
          values={{
            ...formDefaults,
            ...listing,
            jurisdictions: { id: "jurisdiction-id" },
            listingImages,
          }}
        >
          <ListingPhotos
            enableListingImageAltText={true}
            requiredFields={["listingImages"]}
            jurisdiction={jurisdiction}
          />
        </FormComponent>
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
      render(
        <FormComponent
          values={{
            ...formDefaults,
            ...listing,
            jurisdictions: { id: "jurisdiction-id" },
            listingImages,
          }}
        >
          <ListingPhotos
            enableListingImageAltText={true}
            requiredFields={["listingImages"]}
            jurisdiction={jurisdiction}
          />
        </FormComponent>
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

    it("shows required error when alt text cleared after being present", async () => {
      const jurisdictionWithAltTextRequirement = {
        ...jurisdiction,
        requiredListingFields: ["listingImages.description"],
      }

      render(
        <FormComponent
          values={{
            ...formDefaults,
            ...listing,
            jurisdictions: { id: "jurisdiction-id" },
            listingImages: [
              {
                assets: {
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fileId: "file_1_id",
                  id: "asset_1_id",
                  label: "Asset 1 Label",
                },
                ordinal: 0,
                description: "Alt description for image 1",
              },
            ],
          }}
        >
          <ListingPhotos
            enableListingImageAltText={true}
            requiredFields={jurisdictionWithAltTextRequirement.requiredListingFields}
            jurisdiction={jurisdictionWithAltTextRequirement as Jurisdiction}
          />
        </FormComponent>
      )

      const editPhotosButton = screen.getByRole("button", { name: "Edit photos" })
      await userEvent.click(editPhotosButton)

      const drawer = await screen.findByRole("dialog", { name: "Edit photos" })
      await userEvent.click(within(drawer).getByRole("button", { name: "Edit" }))

      const altTextDrawer = await screen.findByRole("dialog", { name: "Add image description" })
      const altTextInput = within(altTextDrawer).getByLabelText(/Image description \(alt text\)/i, {
        exact: false,
      })
      await userEvent.clear(altTextInput)
      await userEvent.click(within(altTextDrawer).getByRole("button", { name: "Save" }))

      expect(within(altTextDrawer).getByText("This field is required")).toBeInTheDocument()
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
        <FormComponent
          values={{
            ...formDefaults,
            ...listing,
            jurisdictions: { id: "jurisdiction-id" },
            listingImages: [],
          }}
        >
          <ListingPhotos
            enableListingImageAltText={true}
            requiredFields={["listingImages"]}
            jurisdiction={jurisdiction}
          />
        </FormComponent>
      )

      const addPhotosButton = screen.getByRole("button", { name: "Add photos" })
      await userEvent.click(addPhotosButton)

      const addPhotosDrawer = await screen.findByRole("dialog", { name: "Add photos" })
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
