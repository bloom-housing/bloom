import React from "react"
import userEvent from "@testing-library/user-event"
import MarketingFlyer from "../../../../../src/components/listings/PaperListingForm/sections/MarketingFlyer"
import { mockNextRouter, render, screen, waitFor, within } from "../../../../testUtils"
import * as helpers from "../../../../../src/lib/helpers"

jest.mock("../../../../../src/lib/helpers", () => ({
  ...jest.requireActual("../../../../../src/lib/helpers"),
  cloudinaryFileUploader: jest.fn(),
}))

beforeAll(() => {
  mockNextRouter()
})

describe("MarketingFlyer", () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it("should render marketing flyer section with add button when no data exists", () => {
    render(<MarketingFlyer currentData={{}} onSubmit={mockOnSubmit} />)

    expect(screen.getByRole("heading", { level: 3, name: "Marketing flyer" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Add marketing flyer" })).toBeInTheDocument()
  })

  it("should display both marketing and accessible flyer file entries", () => {
    render(
      <MarketingFlyer
        currentData={{
          marketingFlyer: "http://test.url.com",
          listingsMarketingFlyerFile: {
            fileId: "test_file_id",
            label: "test_file",
          },
          accessibleMarketingFlyer: "http://accessible.url.com",
          listingsAccessibleMarketingFlyerFile: {
            fileId: "accessible_file_id",
            label: "accessible_file",
          },
        }}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByRole("heading", { level: 3, name: "Marketing flyer" })).toBeInTheDocument()
    expect(screen.getByText("test_file_id")).toBeInTheDocument()
    expect(screen.getByText("accessible_file_id")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Edit marketing flyer" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2)
  })

  it("should display both marketing and accessible flyer URL entries", () => {
    render(
      <MarketingFlyer
        currentData={{
          marketingFlyer: "http://test.url.com",
          accessibleMarketingFlyer: "http://accessible.url.com",
        }}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByRole("heading", { level: 3, name: "Marketing flyer" })).toBeInTheDocument()
    expect(screen.getByText("http://test.url.com")).toBeInTheDocument()
    expect(screen.getByText("http://accessible.url.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Edit marketing flyer" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2)
  })

  it("should render file and URL values with mixed data", () => {
    render(
      <MarketingFlyer
        currentData={{
          listingsMarketingFlyerFile: {
            fileId: "folder/subfolder/file_name.pdf",
            label: "fileLabel",
          },
          accessibleMarketingFlyer: "http://accessible.url.com",
        }}
        onSubmit={mockOnSubmit}
      />
    )

    const table = screen.getByRole("table")
    const tableWithin = within(table)

    const marketingLabel = tableWithin.getByText("Marketing flyer")

    expect(marketingLabel).toBeInTheDocument()
    expect(tableWithin.getByText("file_name.pdf")).toBeInTheDocument()
    expect(tableWithin.getByText("Accessible marketing flyer")).toBeInTheDocument()
    expect(tableWithin.getByText("http://accessible.url.com")).toBeInTheDocument()
  })

  it("should handle file upload and url save", async () => {
    const mockCloudinaryUploader = helpers.cloudinaryFileUploader as jest.MockedFunction<
      typeof helpers.cloudinaryFileUploader
    >
    // eslint-disable-next-line @typescript-eslint/require-await
    mockCloudinaryUploader.mockImplementation(async ({ setCloudinaryData, setProgressValue }) => {
      setProgressValue(100)
      setCloudinaryData({
        id: "test-cloudinary-id/test-file",
        url: "https://test.cloudinary.com/test-file.pdf",
      })
    })

    render(<MarketingFlyer currentData={{}} onSubmit={mockOnSubmit} />)

    const addButton = screen.getByRole("button", { name: "Add marketing flyer" })
    await userEvent.click(addButton)

    const uploadRadio = screen.getByRole("radio", { name: "Upload PDF" })
    await userEvent.click(uploadRadio)

    const file = new File(["mocked flyer pdf content"], "flyer.pdf", {
      type: "application/pdf",
    })
    const dropzone = screen.getByLabelText("Upload file")

    await userEvent.upload(dropzone, file)

    await waitFor(() => {
      expect(screen.getByText("test-file")).toBeInTheDocument()
    })

    const accessibleUrlRadio = screen.getByRole("radio", {
      name: "Webpage URL to an accessible version",
    })
    await userEvent.click(accessibleUrlRadio)

    const accessibleUrlInput = screen.getByLabelText("Informational webpage URL", {
      selector: "#accessibleMarketingFlyerURL",
    })
    await userEvent.type(accessibleUrlInput, "https://accessible.example.com")

    const saveButton = screen.getByRole("button", { name: "Save" })
    await userEvent.click(saveButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      marketingFlyer: "",
      listingsMarketingFlyerFile: {
        fileId: "test-cloudinary-id/test-file",
        label: "cloudinaryPDF",
      },
      accessibleMarketingFlyer: "https://accessible.example.com",
      listingsAccessibleMarketingFlyerFile: {
        fileId: "",
        label: "",
      },
    })

    expect(screen.queryByRole("heading", { name: "Add marketing flyer" })).not.toBeInTheDocument()
  })

  it("should edit existing entries by switching marketing to URL and accessible to file", async () => {
    const mockCloudinaryUploader = helpers.cloudinaryFileUploader as jest.MockedFunction<
      typeof helpers.cloudinaryFileUploader
    >
    // eslint-disable-next-line @typescript-eslint/require-await
    mockCloudinaryUploader.mockImplementation(async ({ setCloudinaryData, setProgressValue }) => {
      setProgressValue(100)
      setCloudinaryData({
        id: "accessible-upload-id/new-accessible-file",
        url: "https://test.cloudinary.com/new-accessible-file.pdf",
      })
    })

    render(
      <MarketingFlyer
        currentData={{
          listingsMarketingFlyerFile: {
            fileId: "folder/subfolder/original.pdf",
            label: "cloudinaryPDF",
          },
          accessibleMarketingFlyer: "https://existing-accessible-url.com",
        }}
        onSubmit={mockOnSubmit}
      />
    )

    const editButton = screen.getByRole("button", { name: "Edit marketing flyer" })
    await userEvent.click(editButton)

    const existingMarketingFiles = screen.getAllByText("original.pdf")
    //listing table + table from modal drawer
    expect(existingMarketingFiles.length).toEqual(2)
    expect(screen.getByRole("radio", { name: "Upload PDF" })).toBeChecked()

    const accessibleUrlRadio = screen.getByRole("radio", {
      name: "Webpage URL to an accessible version",
    })
    expect(accessibleUrlRadio).toBeChecked()

    const accessibleUrlInput = screen.getByRole("textbox", { name: "Informational webpage URL" })
    expect(accessibleUrlInput).toHaveValue("https://existing-accessible-url.com")

    const marketingUrlRadio = screen.getByRole("radio", { name: "Webpage URL" })
    await userEvent.click(marketingUrlRadio)

    const marketingUrlInput = screen.getByLabelText("Informational webpage URL", {
      selector: "#marketingFlyerURL",
    })
    await userEvent.clear(marketingUrlInput)
    await userEvent.type(marketingUrlInput, "https://new-marketing-url.com")

    const accessibleUploadRadio = screen.getByRole("radio", {
      name: "Upload accessible PDF",
    })
    await userEvent.click(accessibleUploadRadio)

    const accessibleDropzone = screen.getByLabelText("Upload file")
    const accessibleFile = new File(["new accessible content"], "new-accessible.pdf", {
      type: "application/pdf",
    })
    await userEvent.upload(accessibleDropzone, accessibleFile)

    await waitFor(() => {
      expect(screen.getByText("new-accessible-file")).toBeInTheDocument()
    })

    const saveButton = screen.getByRole("button", { name: "Save" })
    await userEvent.click(saveButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      marketingFlyer: "https://new-marketing-url.com",
      listingsMarketingFlyerFile: {
        fileId: "",
        label: "",
      },
      accessibleMarketingFlyer: "",
      listingsAccessibleMarketingFlyerFile: {
        fileId: "accessible-upload-id/new-accessible-file",
        label: "cloudinaryPDF",
      },
    })
  })

  it("should handle delete action for individual flyers", async () => {
    render(
      <MarketingFlyer
        currentData={{
          listingsMarketingFlyerFile: {
            fileId: "test_file_id",
            label: "test_file",
          },
          accessibleMarketingFlyer: "http://accessible.url.com",
        }}
        onSubmit={mockOnSubmit}
      />
    )

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" })
    await userEvent.click(deleteButtons[0])

    expect(mockOnSubmit).toHaveBeenCalledWith({
      marketingFlyer: "",
      listingsMarketingFlyerFile: {
        fileId: "",
        label: "",
      },
      accessibleMarketingFlyer: "http://accessible.url.com",
      listingsAccessibleMarketingFlyerFile: undefined,
    })

    mockOnSubmit.mockClear()
    await userEvent.click(deleteButtons[1])

    expect(mockOnSubmit).toHaveBeenCalledWith({
      marketingFlyer: undefined,
      listingsMarketingFlyerFile: {
        fileId: "test_file_id",
        label: "test_file",
      },
      accessibleMarketingFlyer: "",
      listingsAccessibleMarketingFlyerFile: {
        fileId: "",
        label: "",
      },
    })
  })
})
