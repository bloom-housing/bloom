import { Listing } from "@bloom-housing/backend-core/types"
import { cleanup } from "@testing-library/react"
import {
  cloudinaryUrlFromId,
  getImageUrlFromAsset,
  imageUrlFromListing,
} from "../src/utilities/photos"

afterEach(cleanup)

describe("photos helper", () => {
  it("should return correct cloudinary url", () => {
    expect(cloudinaryUrlFromId("1234", "test")).toBe(
      `https://res.cloudinary.com/test/image/upload/w_400,c_limit,q_65/1234.jpg`
    )
  })

  it("should return correct cloudinary url from a listing with new image field", () => {
    const testListing = {
      images: [
        {
          ordinal: 0,
          image: {
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
