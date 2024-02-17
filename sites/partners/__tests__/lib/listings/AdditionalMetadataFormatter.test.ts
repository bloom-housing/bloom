import { LatitudeLongitude } from "@bloom-housing/ui-components"
import AdditionalMetadataFormatter from "../../../src/lib/listings/AdditionalMetadataFormatter"
import { FormListing, FormMetadata } from "../../../src/lib/listings/formTypes"

const latLong: LatitudeLongitude = {
  latitude: 37.36537,
  longitude: -121.91071,
}

const formatData = (data, metadata) => {
  return new AdditionalMetadataFormatter({ ...data }, metadata).format().data
}

const fixtureData = { reservedCommunityTypes: { id: "12345" } }

describe("AdditionalMetadataFormatter", () => {
  it("should format preferences", () => {
    const metadata = {
      latLong,
      preferences: [
        {
          text: "Preference 1",
        },
        {
          text: "Preference 2",
        },
      ],
      programs: [],
      units: [],
    } as FormMetadata

    expect(formatData(fixtureData, metadata).listingMultiselectQuestions).toEqual([
      { multiselectQuestions: { text: "Preference 1" }, ordinal: 1 },
      { multiselectQuestions: { text: "Preference 2" }, ordinal: 2 },
    ])
  })

  it("should format buildingAddress", () => {
    const address = { street: "123 Anywhere St.", city: "Anytown", state: "CA" }
    const data = {
      ...fixtureData,
      listingsBuildingAddress: address,
    }
    const metadata = {
      preferences: [],
      programs: [],
      latLong,
    }

    expect(formatData(data, metadata).listingsBuildingAddress).toEqual({ ...address, ...latLong })
  })
})
