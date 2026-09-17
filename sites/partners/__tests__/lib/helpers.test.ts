import { Application } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  addAsterisk,
  createDate,
  defaultFieldProps,
  fieldIsRequired,
  getLabel,
  getRentType,
  getRequiredSubNote,
  mergeApplicationNames,
} from "../../src/lib/helpers"
import { t } from "@bloom-housing/ui-components"
import { TempUnit } from "../../src/lib/listings/formTypes"

describe("helpers", () => {
  describe("mergeApplicationNames", () => {
    it("should merge names for one application", () => {
      expect(
        mergeApplicationNames([
          { applicant: { firstName: "FirstA", lastName: "LastA" } } as Application,
        ])
      ).toEqual("FirstA LastA")
    })
    it("should merge names for multiple applications", () => {
      expect(
        mergeApplicationNames([
          { applicant: { firstName: "FirstA", lastName: "LastA" } } as Application,
          { applicant: { firstName: "FirstB", lastName: "LastB" } } as Application,
          { applicant: { firstName: "FirstC", lastName: "LastC" } } as Application,
        ])
      ).toEqual("FirstA LastA, FirstB LastB, FirstC LastC")
    })
    it("should merge names for no application", () => {
      expect(mergeApplicationNames([])).toEqual("")
    })
  })
  describe("createDate", () => {
    it("should create dates with variable numbers of characters", () => {
      expect(createDate({ year: "2025", month: "12", day: "10" })).toEqual(new Date(2025, 11, 10))
      expect(createDate({ year: "2025", month: "1", day: "5" })).toEqual(new Date(2025, 0, 5))
      expect(createDate({ year: "2025", month: "01", day: "05" })).toEqual(new Date(2025, 0, 5))
    })
    it("should fail with invalid input", () => {
      expect(createDate({ year: "202", month: "12", day: "10" })).toBeFalsy()
      expect(createDate({ year: "2025", month: "13", day: "10" })).toBeFalsy()
      expect(createDate({ year: "2025", month: "13", day: "35" })).toBeFalsy()
    })
    it("should return UTC midnight when utcMidnight is true", () => {
      expect(createDate({ year: "2030", month: "6", day: "15" }, true)?.toISOString()).toEqual(
        "2030-06-15T00:00:00.000Z"
      )
      expect(createDate(undefined, true)).toBeNull()
    })
  })
  describe("fieldIsRequired", () => {
    it("should return true if field is required", () => {
      expect(fieldIsRequired("fieldName", ["fieldName"])).toBe(true)
    })
    it("should return false if field is not required", () => {
      expect(fieldIsRequired("fieldName", ["notFieldName"])).toBe(false)
    })
  })
  describe("getRequiredSubNote", () => {
    it("should return string if field is required", () => {
      expect(getRequiredSubNote("fieldName", ["fieldName"])).toBe(t("listings.requiredToPublish"))
    })
    it("should return null if field is not required", () => {
      expect(getRequiredSubNote("fieldName", ["notFieldName"])).toBe(null)
    })
  })
  describe("getLabel", () => {
    it("should return label with asterisk if field is required", () => {
      expect(getLabel("fieldName", ["fieldName"], "Field Name", true)).toBe("Field Name *")
    })
    it("should return label without asterisk if field is not required", () => {
      expect(getLabel("fieldName", ["notFieldName"], "Field Name", true)).toBe("Field Name")
    })
  })
  describe("addAsterisk", () => {
    it("should return string with asterisk", () => {
      expect(addAsterisk("Field Name", true)).toBe("Field Name *")
    })
  })
  describe("defaultFieldProps", () => {
    it("should return correctly in a non-error state for a required field", () => {
      expect(
        defaultFieldProps("fieldName", "Field Name", ["fieldName"], {}, jest.fn(), false, true)
      ).toStrictEqual({
        id: "fieldName",
        name: "fieldName",
        label: "Field Name *",
        error: false,
        errorMessage: undefined,
        inputProps: {
          "aria-required": true,
          onChange: expect.any(Function),
        },
      })
    })
    it("should return correctly in an error state for a required field", () => {
      expect(
        defaultFieldProps(
          "fieldName",
          "Field Name",
          ["fieldName"],
          { fieldName: { message: "Custom error" } },
          jest.fn(),
          false,
          true
        )
      ).toStrictEqual({
        id: "fieldName",
        name: "fieldName",
        label: "Field Name *",
        error: true,
        errorMessage: "Custom error",
        inputProps: {
          "aria-required": true,
          onChange: expect.any(Function),
        },
      })
    })
    it("should return correctly in a non-error state for a non-required field", () => {
      expect(
        defaultFieldProps("fieldName", "Field Name", ["notFieldName"], {}, jest.fn(), false, true)
      ).toStrictEqual({
        id: "fieldName",
        name: "fieldName",
        label: "Field Name",
        error: false,
        errorMessage: undefined,
        inputProps: {
          "aria-required": false,
          onChange: expect.any(Function),
        },
      })
    })
    it("should return correctly in an error state for a non-required field", () => {
      expect(
        defaultFieldProps(
          "fieldName",
          "Field Name",
          ["notFieldName"],
          { fieldName: { message: "Custom error" } },
          jest.fn(),
          false,
          true
        )
      ).toStrictEqual({
        id: "fieldName",
        name: "fieldName",
        label: "Field Name",
        error: true,
        errorMessage: "Custom error",
        inputProps: {
          "aria-required": false,
          onChange: expect.any(Function),
        },
      })
    })
    it("should return correctly for a non-required field but when forceRequired is true", () => {
      expect(
        defaultFieldProps("fieldName", "Field Name", ["notFieldName"], {}, jest.fn(), true, true)
      ).toStrictEqual({
        id: "fieldName",
        name: "fieldName",
        label: "Field Name *",
        error: false,
        errorMessage: undefined,
        inputProps: {
          "aria-required": true,
          onChange: expect.any(Function),
        },
      })
    })
  })
  describe("getRentType", () => {
    describe("for non land use listings", () => {
      it("should return fixed when both minimum income and rent are set", () => {
        expect(getRentType({ monthlyIncomeMin: "3600", monthlyRent: "1200" } as TempUnit)).toEqual(
          "fixed"
        )
      })
      it("should return null when only rent is set", () => {
        expect(getRentType({ monthlyRent: "1200" } as TempUnit)).toBeNull()
      })
      it("should return null when only minimum income is set", () => {
        expect(getRentType({ monthlyIncomeMin: "3600" } as TempUnit)).toBeNull()
      })
      it("should return percentage for a percentage unit stamped with a zero minimum income", () => {
        expect(
          getRentType({
            monthlyIncomeMin: "0",
            monthlyRentAsPercentOfIncome: "30",
          } as TempUnit)
        ).toEqual("percentage")
      })
      it("should prefer fixed when both percent and fixed values are set", () => {
        expect(
          getRentType({
            monthlyIncomeMin: "3600",
            monthlyRent: "1200",
            monthlyRentAsPercentOfIncome: "30",
          } as TempUnit)
        ).toEqual("fixed")
      })
      it("should return null when no rent fields are set", () => {
        expect(getRentType({} as TempUnit)).toBeNull()
      })
      it("should return null for a missing unit", () => {
        expect(getRentType(null as unknown as TempUnit)).toBeNull()
      })
    })

    describe("for land use listings", () => {
      it("should return fixed when both minimum income and rent are set", () => {
        expect(
          getRentType({ monthlyIncomeMin: "3600", monthlyRent: "1200" } as TempUnit, true)
        ).toEqual("fixed")
      })
      it("should return fixed when only rent is set", () => {
        expect(getRentType({ monthlyRent: "1200" } as TempUnit, true)).toEqual("fixed")
      })
      it("should return fixed when only minimum income is set", () => {
        expect(getRentType({ monthlyIncomeMin: "3600" } as TempUnit, true)).toEqual("fixed")
      })
      it("should return percentage for a percentage unit stamped with a zero minimum income", () => {
        expect(
          getRentType(
            {
              monthlyIncomeMin: "0",
              monthlyRentAsPercentOfIncome: "30",
            } as TempUnit,
            true
          )
        ).toEqual("percentage")
      })
      it("should prefer percentage when both percent and fixed values are set", () => {
        expect(
          getRentType(
            {
              monthlyIncomeMin: "3600",
              monthlyRent: "1200",
              monthlyRentAsPercentOfIncome: "30",
            } as TempUnit,
            true
          )
        ).toEqual("percentage")
      })
      it("should return null when no rent fields are set", () => {
        expect(getRentType({} as TempUnit, true)).toBeNull()
      })
      it("should return null for a missing unit", () => {
        expect(getRentType(null as unknown as TempUnit, true)).toBeNull()
      })
    })
  })
})
