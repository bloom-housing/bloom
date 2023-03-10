import { LatitudeLongitude } from "@bloom-housing/ui-components"
import AdditionalMetadataFormatter from "../../../src/lib/listings/AdditionalMetadataFormatter"
import { FormListing } from "../../../src/lib/listings/formTypes"

const latLong: LatitudeLongitude = {
  latitude: 37.36537,
  longitude: -121.91071,
}

const formatData = (data, metadata) => {
  return new AdditionalMetadataFormatter({ ...data }, metadata).format().data
}

const fixtureData = {
  reservedCommunityType: { id: "12345" },
  neighborhoodAmenities: {},
} as FormListing

describe("AdditionalMetadataFormatter", () => {
  it("should format buildingAddress", () => {
    const address = { street: "123 Anywhere St.", city: "Anytown", state: "CA" }
    const data = {
      ...fixtureData,
      buildingAddress: address,
    }
    const metadata = {
      preferences: [],
      programs: [],
      latLong,
    }

    expect(formatData(data, metadata).buildingAddress).toEqual({ ...address, ...latLong })
  })
})
