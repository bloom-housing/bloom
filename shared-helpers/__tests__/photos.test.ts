import { Listing } from "@bloom-housing/backend-core/types"
import { cleanup } from "@testing-library/react"
import { cloudinaryUrlFromId, imageUrlFromListing } from "../src/photos"

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

  it("should return correct cloudinary url from a listing with new image field", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    const testListing = {
      image: {
        fileId: "1234",
        label: "cloudinaryBuilding",
      },
    } as Listing

    expect(imageUrlFromListing(testListing)).toBe(
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

    expect(imageUrlFromListing(testListing)).toBe("5678")
  })
})
