import { cleanup } from "@testing-library/react"
import {
  cloudinaryUrlFromId,
  getImageUrlFromAsset,
  imageUrlFromListing,
} from "../src/utilities/photos"
import { Listing, ListingsStatusEnum } from "../src/types/backend-swagger"

afterEach(cleanup)

describe("photos helper", () => {
  it("should return correct cloudinary url", () => {
    expect(cloudinaryUrlFromId("1234", "test")).toBe(
      `https://res.cloudinary.com/test/image/upload/w_400,c_limit,q_65/1234.jpg`
    )
  })

  it("should return correct cloudinary url from a listing with new image field", () => {
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

    // set CLOUDINARY_CLOUD_NAME to known value
    const prevCloudName = process.env.CLOUDINARY_CLOUD_NAME
    process.env.CLOUDINARY_CLOUD_NAME = "exygy"

    expect(imageUrlFromListing(testListing)[0]).toBe(
      `https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/1234.jpg`
    )

    // change it back to previous value
    process.env.CLOUDINARY_CLOUD_NAME = prevCloudName
  })

  it("should return correct id when falling back to old field", () => {
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

  it.skip("should return correct urls from AssetCreate", () => {
    const tests = [
      {
        asset: {
          fileId: "https://url.to/asset",
          label: "url",
        },
        expect: "https://url.to/asset",
      },
      {
        asset: {
          fileId: "1234",
          label: "cloudinaryBuilding", // should call cloudinaryUrlFromId
        },
        size: 400,
        cloudinaryCloudName: "exygy",
        expect: "https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/1234.jpg",
      },
      {
        asset: {
          fileId: "1234",
          label: "default",
        },
        expect: null,
      },
    ]

    tests.forEach((test) => {
      expect(getImageUrlFromAsset(test.asset, test.size, test.cloudinaryCloudName)).toBe(
        test.expect
      )
    })
  })
})
