import { overrideTranslations } from "../../src/lib/translations"

describe("public translation overrides", () => {
  it("spells out public unit type acronyms", () => {
    expect(overrideTranslations.en["listings.singleRoomOccupancy"]).toEqual("Single Room Occupancy")
    expect(overrideTranslations.en["listings.unitTypes.SRO"]).toEqual("Single Room Occupancy")
    expect(overrideTranslations.en["listings.unitTypes.oneBdrm"]).toEqual("1 Bedroom")
    expect(overrideTranslations.en["listings.unitTypes.twoBdrm"]).toEqual("2 Bedrooms")
    expect(overrideTranslations.en["listings.unitTypes.threeBdrm"]).toEqual("3 Bedrooms")
    expect(overrideTranslations.en["listings.unitTypes.fourBdrm"]).toEqual("4 Bedrooms")
    expect(overrideTranslations.en["listings.unitTypes.fiveBdrm"]).toEqual("5 Bedrooms")
  })
})
