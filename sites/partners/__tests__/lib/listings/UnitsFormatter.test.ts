import { EnumListingListingType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import UnitsFormatter from "../../../src/lib/listings/UnitsFormatter"
import { FormListing, FormMetadata, TempUnit } from "../../../src/lib/listings/formTypes"

const formatUnits = (listingType: EnumListingListingType, units: TempUnit[]) =>
  new UnitsFormatter({ listingType } as FormListing, { units } as FormMetadata).format().data
    .units as TempUnit[]

describe("UnitsFormatter", () => {
  describe("blank rent fields", () => {
    const otherListingTypes = [
      EnumListingListingType.regulated,
      EnumListingListingType.nonRegulated,
    ]

    it("should remove a blank monthlyIncomeMin on land use listings", () => {
      const [unit] = formatUnits(EnumListingListingType.landUse, [
        { monthlyIncomeMin: "", monthlyRent: "1200" } as TempUnit,
      ])

      expect(unit).not.toHaveProperty("monthlyIncomeMin")
      expect(unit.monthlyRent).toEqual("1200")
    })

    it("should remove a blank monthlyRent on land use listings", () => {
      const [unit] = formatUnits(EnumListingListingType.landUse, [
        { monthlyIncomeMin: "3600", monthlyRent: "" } as TempUnit,
      ])

      expect(unit).not.toHaveProperty("monthlyRent")
      expect(unit.monthlyIncomeMin).toEqual("3600")
    })

    it.each(otherListingTypes)(
      "should leave a blank monthlyIncomeMin untouched on %s listings",
      (listingType) => {
        const [unit] = formatUnits(listingType, [
          { monthlyIncomeMin: "", monthlyRent: "1200" } as TempUnit,
        ])

        expect(unit.monthlyIncomeMin).toEqual("")
      }
    )

    it.each(otherListingTypes)(
      "should leave a blank monthlyRent untouched on %s listings",
      (listingType) => {
        const [unit] = formatUnits(listingType, [
          { monthlyIncomeMin: "3600", monthlyRent: "" } as TempUnit,
        ])

        expect(unit.monthlyRent).toEqual("")
      }
    )

    it("should keep populated rent values", () => {
      const [unit] = formatUnits(EnumListingListingType.landUse, [
        { monthlyIncomeMin: "3600", monthlyRent: "1200" } as TempUnit,
      ])

      expect(unit.monthlyIncomeMin).toEqual("3600")
      expect(unit.monthlyRent).toEqual("1200")
    })

    it("should keep the zero minimum income stamped on percentage units", () => {
      const [unit] = formatUnits(EnumListingListingType.landUse, [
        { monthlyIncomeMin: "0", monthlyRentAsPercentOfIncome: "30" } as TempUnit,
      ])

      expect(unit.monthlyIncomeMin).toEqual("0")
    })
  })
})
