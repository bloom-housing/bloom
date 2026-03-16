import { cleanup } from "@testing-library/react"
import { cloudinaryUrlFromId, imageUrlFromListing } from "../src/utilities/photos"
import { Listing, ListingsStatusEnum } from "../src/types/backend-swagger"

afterEach(cleanup)

describe("photos helper", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it("should return correct cloudinary url", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"
    expect(cloudinaryUrlFromId("1234")).toBe(
      `https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/1234.jpg`
    )
  })

  it("should return original id when cloudinary env is not set", () => {
    delete process.env.CLOUDINARY_CLOUD_NAME
    delete process.env.cloudinaryCloudName

    expect(cloudinaryUrlFromId("https://aws.example.com/image.jpg")).toBe(
      "https://aws.example.com/image.jpg"
    )
  })

  it("should return correct cloudinary url from a listing with new image field", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    const testListing = {
      id: "id123",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "listing with images",
      status: ListingsStatusEnum.active,
      listingImages: [
        {
          ordinal: 0,
          assets: {
            fileId: "1234",
            label: "cloudinaryBuilding",
          },
        },
      ],
    } as Listing

    expect(imageUrlFromListing(testListing)[0]).toBe(
      `https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/1234.jpg`
    )
  })

  it("should return correct id when falling back to old field", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    const testListing = {
      assets: [
        {
          fileId: "5678",
          label: "building",
        },
      ],
    } as Listing

    expect(imageUrlFromListing(testListing)[0]).toBe("5678")
  })

  it("should return building asset from listingImages when cloudinary env is set", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    const testListing = {
      id: "id456",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "listing with legacy-labeled image in new field",
      status: ListingsStatusEnum.active,
      listingImages: [
        {
          ordinal: 0,
          assets: {
            fileId: "legacy-building-id",
            label: "building",
          },
        },
      ],
    } as Listing

    expect(imageUrlFromListing(testListing)[0]).toBe("legacy-building-id")
  })

  it("should return random-labeled listingImages asset when cloudinary env is not set", () => {
    delete process.env.CLOUDINARY_CLOUD_NAME
    delete process.env.cloudinaryCloudName

    const testListing = {
      id: "id789",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "listing with random label",
      status: ListingsStatusEnum.active,
      listingImages: [
        {
          ordinal: 0,
          assets: {
            fileId: "random-label-id",
            label: "someRandomLabel",
          },
        },
      ],
    } as Listing

    expect(imageUrlFromListing(testListing)[0]).toBe("random-label-id")
  })
})
