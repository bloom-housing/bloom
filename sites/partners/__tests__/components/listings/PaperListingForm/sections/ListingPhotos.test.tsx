import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { formDefaults, FormListing } from "../../../../../src/lib/listings/formTypes"
import { setupServer } from "msw/lib/node"
import { mockNextRouter } from "../../../../testUtils"
import { render, screen, within } from "@testing-library/react"
import ListingPhotos from "../../../../../src/components/listings/PaperListingForm/sections/ListingPhotos"
import { jurisdiction, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"

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
          <ListingPhotos requiredFields={[]} jurisdiction={jurisdiction} />
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
            requiredFields={["listingImages"]}
            jurisdiction={{ ...jurisdiction, minimumListingPublishImagesRequired: 3 }}
          />
        </FormComponent>
      )

      const imagesTable = screen.getByRole("table")
      expect(imagesTable).toBeInTheDocument()

      const [head, body] = within(imagesTable).getAllByRole("rowgroup")

      const headerColumns = within(head).getAllByRole("columnheader")
      expect(headerColumns).toHaveLength(3)
      const [previewHeader, primaryHeader, actionsHeader] = headerColumns
      expect(previewHeader).toHaveTextContent("Preview")
      expect(primaryHeader).toHaveTextContent("Primary")
      expect(actionsHeader).not.toHaveTextContent()

      const rows = within(body).getAllByRole("row")
      expect(rows).toHaveLength(2)

      const [firstPreview, firstPrimary, firstActions] = within(rows[0]).getAllByRole("cell")
      expect(within(firstPreview).getByRole("presentation")).toBeInTheDocument()
      expect(within(firstPreview).getByRole("presentation")).toHaveAttribute("src", "file_1_id")
      expect(firstPrimary).toHaveTextContent("Primary photo")
      expect(within(firstActions).getByRole("button", { name: "Delete" })).toBeInTheDocument()

      const [secondPreview, secondPrimary, secondActions] = within(rows[1]).getAllByRole("cell")
      expect(within(secondPreview).getByRole("presentation")).toBeInTheDocument()
      expect(within(secondPreview).getByRole("presentation")).toHaveAttribute("src", "file_2_id")
      expect(secondPrimary).not.toHaveTextContent("Primary photo")
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
})
