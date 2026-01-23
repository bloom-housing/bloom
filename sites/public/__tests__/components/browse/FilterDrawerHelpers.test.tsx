import React from "react"
import { screen } from "@testing-library/dom"
import {
  FilterAvailabilityEnum,
  HomeTypeEnum,
  ListingFilterKeys,
  RegionEnum,
  UnitTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  buildDefaultFilterFields,
  CheckboxGroup,
  decodeQueryToFilterData,
  encodeFilterDataToBackendFilters,
  encodeFilterDataToQuery,
  FilterData,
  getAvailabilityValues,
  getFilterQueryFromURL,
  isFiltered,
  removeUnselectedFilterData,
  RentSection,
  SearchSection,
} from "../../../src/components/browse/FilterDrawerHelpers"
import { mockNextRouter, render } from "../../testUtils"
import { useForm } from "react-hook-form"
import { t } from "@bloom-housing/ui-components"
import userEvent from "@testing-library/user-event"

describe("filter drawer helpers", () => {
  const emptyFormData: FilterData = {
    [ListingFilterKeys.isVerified]: false,
    [ListingFilterKeys.availabilities]: {
      [FilterAvailabilityEnum.unitsAvailable]: false,
      [FilterAvailabilityEnum.openWaitlist]: false,
      [FilterAvailabilityEnum.closedWaitlist]: false,
      [FilterAvailabilityEnum.comingSoon]: false,
    },
    [ListingFilterKeys.homeTypes]: {
      [HomeTypeEnum.apartment]: false,
      [HomeTypeEnum.duplex]: false,
      [HomeTypeEnum.house]: false,
      [HomeTypeEnum.townhome]: false,
    },
    [ListingFilterKeys.bedroomTypes]: {
      [UnitTypeEnum.studio]: false,
      [UnitTypeEnum.SRO]: false,
      [UnitTypeEnum.oneBdrm]: false,
      [UnitTypeEnum.twoBdrm]: false,
      [UnitTypeEnum.threeBdrm]: false,
      [UnitTypeEnum.fourBdrm]: false,
      [UnitTypeEnum.fiveBdrm]: false,
    },
    [ListingFilterKeys.monthlyRent]: {
      minRent: "",
      maxRent: "",
    },
    [ListingFilterKeys.section8Acceptance]: false,
    regions: {
      [RegionEnum.Greater_Downtown]: false,
      [RegionEnum.Eastside]: false,
      [RegionEnum.Southwest]: false,
      [RegionEnum.Westside]: false,
    },
    [ListingFilterKeys.listingFeatures]: {
      wheelchairRamp: false,
      elevator: false,
      serviceAnimalsAllowed: false,
      accessibleParking: false,
      parkingOnSite: false,
      inUnitWasherDryer: false,
      laundryInBuilding: false,
      barrierFreeEntrance: false,
      rollInShower: false,
      grabBars: false,
      heatingInUnit: false,
      acInUnit: false,
      hearing: false,
      mobility: false,
      visual: false,
      barrierFreeUnitEntrance: false,
      loweredLightSwitch: false,
      barrierFreeBathroom: false,
      wideDoorways: false,
      loweredCabinets: false,
    },
    [ListingFilterKeys.name]: "",
    [ListingFilterKeys.multiselectQuestions]: {
      "580a62bd-ec9d-4a7d-9eb1-bf229c912ee2": false,
      "ee9b0764-4968-4804-ba8e-b58abb56dd70": false,
      "e61b4f64-bcab-439b-838e-03f54d33848d": false,
      "5c0ad984-8250-43a7-b968-3905b782b20e": false,
    },
  }

  describe("getAvailabilityValues", () => {
    it("should return correct availability strings in order", () => {
      expect(getAvailabilityValues(false)).toEqual([
        FilterAvailabilityEnum.unitsAvailable,
        FilterAvailabilityEnum.openWaitlist,
        FilterAvailabilityEnum.closedWaitlist,
        FilterAvailabilityEnum.comingSoon,
      ])
    })
  })
  describe("buildDefaultFilterFields", () => {
    it("should return correct fields when labelInfo passed as string", () => {
      const defaultFilterFields = buildDefaultFilterFields(
        ListingFilterKeys.homeTypes,
        "listings.homeType",
        Object.keys(HomeTypeEnum),
        {}
      )
      expect(defaultFilterFields).toStrictEqual([
        {
          key: "homeTypes.apartment",
          label: "Apartment",
          defaultChecked: false,
        },
        { key: "homeTypes.duplex", label: "Duplex", defaultChecked: false },
        {
          key: "homeTypes.house",
          label: "Single family house",
          defaultChecked: false,
        },
        {
          key: "homeTypes.townhome",
          label: "Townhome",
          defaultChecked: false,
        },
      ])
    })
    it("should return correct fields when labelInfo passed as string array", () => {
      const customLabeledFilterFields = buildDefaultFilterFields(
        ListingFilterKeys.homeTypes,
        [
          "Custom Home Type One",
          "Custom Home Type Two",
          "Custom Home Type Three",
          "Custom Home Type Four",
        ],
        Object.keys(HomeTypeEnum),
        {}
      )
      expect(customLabeledFilterFields).toStrictEqual([
        {
          key: "homeTypes.apartment",
          label: "Custom Home Type One",
          defaultChecked: false,
        },
        { key: "homeTypes.duplex", label: "Custom Home Type Two", defaultChecked: false },
        {
          key: "homeTypes.house",
          label: "Custom Home Type Three",
          defaultChecked: false,
        },
        {
          key: "homeTypes.townhome",
          label: "Custom Home Type Four",
          defaultChecked: false,
        },
      ])
    })
    it("should return correct fields when existingData is partial form object", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.bedroomTypes]: {
          [UnitTypeEnum.studio]: true,
        },
      }

      const defaultFilterFields = buildDefaultFilterFields(
        ListingFilterKeys.homeTypes,
        "listings.homeType",
        Object.keys(HomeTypeEnum),
        partialFormObject
      )

      expect(defaultFilterFields).toStrictEqual([
        {
          key: "homeTypes.apartment",
          label: "Apartment",
          defaultChecked: true,
        },
        { key: "homeTypes.duplex", label: "Duplex", defaultChecked: false },
        {
          key: "homeTypes.house",
          label: "Single family house",
          defaultChecked: false,
        },
        {
          key: "homeTypes.townhome",
          label: "Townhome",
          defaultChecked: false,
        },
      ])
    })
    it("should return correct fields when existingData is the full form object", () => {
      const fullFormWithSelections: FilterData = {
        ...emptyFormData,
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.duplex]: true,
          [HomeTypeEnum.townhome]: true,
        },
      }
      const defaultFilterFields = buildDefaultFilterFields(
        ListingFilterKeys.homeTypes,
        "listings.homeType",
        Object.keys(HomeTypeEnum),
        fullFormWithSelections
      )

      expect(defaultFilterFields).toStrictEqual([
        {
          key: "homeTypes.apartment",
          label: "Apartment",
          defaultChecked: false,
        },
        { key: "homeTypes.duplex", label: "Duplex", defaultChecked: true },
        {
          key: "homeTypes.house",
          label: "Single family house",
          defaultChecked: false,
        },
        {
          key: "homeTypes.townhome",
          label: "Townhome",
          defaultChecked: true,
        },
      ])
    })
  })

  describe("encodeFilterToBackendFiltering", () => {
    it("should return correct BE filters for single IN comparison with single selection", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.availabilities]: { [FilterAvailabilityEnum.openWaitlist]: true },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        { $comparison: "IN", availabilities: ["openWaitlist"] },
      ])
    })
    it("should return correct BE filters for single IN comparison with multiple selections", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.availabilities]: {
          [FilterAvailabilityEnum.openWaitlist]: true,
          [FilterAvailabilityEnum.unitsAvailable]: true,
        },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        { $comparison: "IN", availabilities: ["openWaitlist", "unitsAvailable"] },
      ])
    })
    it("should return correct BE filters for multiple IN comparisons", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.bedroomTypes]: { [UnitTypeEnum.studio]: true },
        [ListingFilterKeys.listingFeatures]: { mobility: true },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        { $comparison: "IN", bedroomTypes: [0] },
        { $comparison: "IN", listingFeatures: ["mobility"] },
      ])
    })
    it("should return correct BE filters for single = comparison", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.isVerified]: true,
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([{ $comparison: "=", isVerified: true }])
    })
    it("should return correct BE filters for multiple = comparisons", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.section8Acceptance]: true,
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        { $comparison: "=", isVerified: true },
        { $comparison: "=", section8Acceptance: true },
      ])
    })
    it("should return correct BE filters for >= comparison", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00" },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([{ $comparison: ">=", monthlyRent: "500.00" }])
    })
    it("should return correct BE filters for <= comparison", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.monthlyRent]: { maxRent: "900.00" },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([{ $comparison: "<=", monthlyRent: "900.00" }])
    })
    it("should return correct BE filters for <= comparison and value with comma", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.monthlyRent]: { maxRent: "1,500.00" },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([{ $comparison: "<=", monthlyRent: "1500.00" }])
    })
    it("should return correct BE filters for full rent information", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        { $comparison: ">=", monthlyRent: "500.00" },
        { $comparison: "<=", monthlyRent: "900.00" },
      ])
    })
    it("should return correct BE filters for search by name", () => {
      const filterData: FilterData = {
        name: "Listing Name",
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([{ $comparison: "LIKE", name: "Listing Name" }])
    })
    it("should return correct BE filters for all comparison types combined", () => {
      const filterData: FilterData = {
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.availabilities]: {
          [FilterAvailabilityEnum.openWaitlist]: true,
          [FilterAvailabilityEnum.unitsAvailable]: true,
        },
        monthlyRent: { minRent: "500.00", maxRent: "900.00" },
        name: "Listing Name",
      }

      const backendFilters = encodeFilterDataToBackendFilters(filterData)
      expect(backendFilters).toStrictEqual([
        {
          $comparison: "=",
          isVerified: true,
        },
        {
          $comparison: "IN",
          availabilities: ["openWaitlist", "unitsAvailable"],
        },
        { $comparison: ">=", monthlyRent: "500.00" },
        { $comparison: "<=", monthlyRent: "900.00" },
        { $comparison: "LIKE", name: "Listing Name" },
      ])
    })
  })

  describe("isFiltered", () => {
    it("should return true if filter params present in context.query", () => {
      expect(isFiltered({ page: "2", name: "a" })).toStrictEqual(true)
    })
    it("should return false if filter params not present in context.query", () => {
      expect(isFiltered({ page: "2" })).toStrictEqual(false)
    })
  })

  describe("getFilterQueryFromURL", () => {
    it("should return filter query without page when page is present in url", () => {
      expect(getFilterQueryFromURL({ page: "2", name: "a" })).toStrictEqual("name=a")
    })
    it("should return filter query without page when page is not present in url", () => {
      expect(getFilterQueryFromURL({ name: "a" })).toStrictEqual("name=a")
    })
  })

  describe("encodeFilterDataToQuery", () => {
    it("should return empty string when filter data is empty", () => {
      expect(encodeFilterDataToQuery({})).toStrictEqual("")
    })
    it("should return correct filter query with single array filter with single selection", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("homeTypes=apartment")
    })
    it("should return correct filter query with single array filter with multiple selections", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
          [HomeTypeEnum.duplex]: true,
        },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("homeTypes=apartment,duplex")
    })
    it("should return correct filter query with multiple array filters", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.bedroomTypes]: {
          [UnitTypeEnum.studio]: true,
        },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual(
        "homeTypes=apartment&bedroomTypes=studio"
      )
    })
    it("should return correct filter query with single boolean filter", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.isVerified]: true,
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("isVerified=true")
    })
    it("should return correct filter query with multiple boolean filters", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.section8Acceptance]: true,
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual(
        "isVerified=true&section8Acceptance=true"
      )
    })
    it("should return correct filter query with min rent filter", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00" },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("monthlyRent=500.00")
    })
    it("should return correct filter query with max rent filter", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.monthlyRent]: { maxRent: "900.00" },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("monthlyRent=900.00")
    })
    it("should return correct filter query with full rent range", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("monthlyRent=500.00-900.00")
    })
    it("should return correct filter query with search by name filter", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.name]: "Listing Name",
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual("name=Listing Name")
    })
    it("should return correct filter query with all filtering types", () => {
      const partialFormObject: FilterData = {
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
          [HomeTypeEnum.duplex]: true,
        },
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
        [ListingFilterKeys.name]: "Listing Name",
      }
      expect(encodeFilterDataToQuery(partialFormObject)).toStrictEqual(
        "isVerified=true&homeTypes=apartment,duplex&monthlyRent=500.00-900.00&name=Listing Name"
      )
    })
    it("should return correct filter query with full form object", () => {
      const fullFormObject: FilterData = {
        ...emptyFormData,
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
        [ListingFilterKeys.name]: "Listing Name",
      }
      expect(encodeFilterDataToQuery(fullFormObject)).toStrictEqual(
        "isVerified=true&homeTypes=apartment&monthlyRent=500.00-900.00&name=Listing Name"
      )
    })
  })

  describe("decodeQueryToFilterData", () => {
    it("should return empty object when filter data is empty", () => {
      expect(decodeQueryToFilterData({})).toStrictEqual({})
    })
    it("should return correct filter data with single array filter query with single selection", () => {
      expect(decodeQueryToFilterData({ homeTypes: "apartment" })).toStrictEqual({
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
      })
    })
    it("should return correct filter data with single array filter query with multiple selections", () => {
      expect(decodeQueryToFilterData({ homeTypes: "apartment,duplex" })).toStrictEqual({
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
          [HomeTypeEnum.duplex]: true,
        },
      })
    })
    it("should return correct filter data with multiple array filter query", () => {
      expect(
        decodeQueryToFilterData({ homeTypes: "apartment", availabilities: "openWaitlist" })
      ).toStrictEqual({
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.availabilities]: {
          [FilterAvailabilityEnum.openWaitlist]: true,
        },
      })
    })
    it("should return correct filter data with single boolean filter query", () => {
      expect(decodeQueryToFilterData({ isVerified: "true" })).toStrictEqual({
        [ListingFilterKeys.isVerified]: true,
      })
    })
    it("should return correct filter data with multiple boolean filter query", () => {
      expect(
        decodeQueryToFilterData({ isVerified: "true", section8Acceptance: "true" })
      ).toStrictEqual({
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.section8Acceptance]: true,
      })
    })
    it("should return correct filter data with min rent filter query", () => {
      expect(decodeQueryToFilterData({ monthlyRent: "500.00" })).toStrictEqual({
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "" },
      })
    })
    it("should return correct filter data with max rent filter query", () => {
      expect(decodeQueryToFilterData({ monthlyRent: "-900.00" })).toStrictEqual({
        [ListingFilterKeys.monthlyRent]: { minRent: "", maxRent: "900.00" },
      })
    })
    it("should return correct filter data with full rent filter query", () => {
      expect(decodeQueryToFilterData({ monthlyRent: "500.00-900.00" })).toStrictEqual({
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
      })
    })
    it("should return correct filter data with search by name filter query", () => {
      expect(decodeQueryToFilterData({ name: "Listing Name" })).toStrictEqual({
        [ListingFilterKeys.name]: "Listing Name",
      })
    })
    it("should return correct filter data with query with all filtering types", () => {
      expect(decodeQueryToFilterData({ name: "Listing Name" })).toStrictEqual({
        [ListingFilterKeys.name]: "Listing Name",
      })
    })
  })

  describe("removeUnselectedFilterData", () => {
    it("should return empty object when filter data has no selections", () => {
      const emptyFormData = {
        isVerified: false,
        availabilities: {
          unitsAvailable: false,
          openWaitlist: false,
          closedWaitlist: false,
          comingSoon: false,
        },
        homeTypes: {
          apartment: false,
          duplex: false,
          house: false,
          townhome: false,
        },
        bedroomTypes: {
          studio: false,
          SRO: false,
          oneBdrm: false,
          twoBdrm: false,
          threeBdrm: false,
          fourBdrm: false,
          fiveBdrm: false,
        },
        monthlyRent: {
          minRent: "",
          maxRent: "",
        },
        section8Acceptance: false,
        regions: {
          Greater_Downtown: false,
          Eastside: false,
          Southwest: false,
          Westside: false,
        },
        listingFeatures: {
          wheelchairRamp: false,
          elevator: false,
          serviceAnimalsAllowed: false,
          accessibleParking: false,
          parkingOnSite: false,
          inUnitWasherDryer: false,
          laundryInBuilding: false,
          barrierFreeEntrance: false,
          rollInShower: false,
          grabBars: false,
          heatingInUnit: false,
          acInUnit: false,
          hearing: false,
          mobility: false,
          visual: false,
          barrierFreeUnitEntrance: false,
          loweredLightSwitch: false,
          barrierFreeBathroom: false,
          wideDoorways: false,
          loweredCabinets: false,
        },
        name: "",
        multiselectQuestions: {
          "580a62bd-ec9d-4a7d-9eb1-bf229c912ee2": false,
          "ee9b0764-4968-4804-ba8e-b58abb56dd70": false,
          "e61b4f64-bcab-439b-838e-03f54d33848d": false,
          "5c0ad984-8250-43a7-b968-3905b782b20e": false,
        },
      }
      expect(removeUnselectedFilterData(emptyFormData)).toStrictEqual({})
    })
    it("should return only true selections when filter data is partially selected", () => {
      const fullFormObject: FilterData = {
        ...emptyFormData,
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
        [ListingFilterKeys.name]: "Listing Name",
      }

      expect(removeUnselectedFilterData(fullFormObject)).toStrictEqual({
        [ListingFilterKeys.isVerified]: true,
        [ListingFilterKeys.homeTypes]: {
          [HomeTypeEnum.apartment]: true,
        },
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
        [ListingFilterKeys.name]: "Listing Name",
      })
    })

    it("should return all selections when the filter data is all selected", () => {
      //handle fields stored as strings
      const fullFormObject: FilterData = {
        ...emptyFormData,
        [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
        [ListingFilterKeys.name]: "Listing Name",
      }
      //make every checkbox selection true
      Object.entries(fullFormObject).forEach(([filterType, userSelections]) => {
        if (userSelections === false) fullFormObject[filterType] = true
        else if (typeof userSelections === "object") {
          Object.entries(userSelections).forEach((field) => {
            if (field[1] === false) fullFormObject[filterType][field[0]] = true
          })
        }
      })

      expect(removeUnselectedFilterData(fullFormObject)).toStrictEqual(fullFormObject)
    })
  })

  // components
  describe("CheckboxGroup", () => {
    beforeEach(() => {
      mockNextRouter()
    })
    const DefaultCheckBoxGroup = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { register } = useForm()

      return (
        <CheckboxGroup
          groupLabel={t("listings.homeType")}
          fields={buildDefaultFilterFields(
            ListingFilterKeys.homeTypes,
            "listings.homeType",
            Object.keys(HomeTypeEnum),
            {}
          )}
          register={register}
        />
      )
    }

    const CustomColumnCheckBoxGroup = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { register } = useForm()

      return (
        <CheckboxGroup
          groupLabel={t("listings.homeType")}
          fields={buildDefaultFilterFields(
            ListingFilterKeys.homeTypes,
            "listings.homeType",
            Object.keys(HomeTypeEnum),
            {}
          )}
          register={register}
          customColumnNumber={1}
        />
      )
    }

    const CheckBoxGroupWithSelections = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { register } = useForm()

      return (
        <CheckboxGroup
          groupLabel={t("listings.homeType")}
          fields={buildDefaultFilterFields(
            ListingFilterKeys.homeTypes,
            "listings.homeType",
            Object.keys(HomeTypeEnum),
            {
              [ListingFilterKeys.homeTypes]: {
                [HomeTypeEnum.apartment]: true,
                [HomeTypeEnum.duplex]: true,
              },
            }
          )}
          register={register}
        />
      )
    }
    it("should show the correct number of columns when no customColumnNumber is added", () => {
      const { container } = render(<DefaultCheckBoxGroup />)
      expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
      expect(container.querySelector("[data-columns='2']")).toBeInTheDocument()
      expect(container.querySelector("[data-columns='1']")).not.toBeInTheDocument()
      expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Apartment" })).not.toBeChecked()
      expect(screen.getByLabelText("Duplex")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Duplex" })).not.toBeChecked()
      expect(screen.getByLabelText("Single family house")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
      expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()
    })
    it("should show the correct number of columns when a customColumnNumber is added", () => {
      const { container } = render(<CustomColumnCheckBoxGroup />)
      expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
      expect(container.querySelector("[data-columns='1']")).toBeInTheDocument()
      expect(container.querySelector("[data-columns='2']")).not.toBeInTheDocument()
      expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Apartment" })).not.toBeChecked()
      expect(screen.getByLabelText("Duplex")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Duplex" })).not.toBeChecked()
      expect(screen.getByLabelText("Single family house")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
      expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()
    })

    it("should show all fields passed into component correctly when a filter state with previous selections is passed", () => {
      const { container } = render(<CheckBoxGroupWithSelections />)
      expect(screen.getByRole("group", { name: "Home type" })).toBeInTheDocument()
      expect(container.querySelector("[data-columns='2']")).toBeInTheDocument()
      expect(container.querySelector("[data-columns='1']")).not.toBeInTheDocument()
      expect(screen.getByLabelText("Apartment")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Apartment" })).toBeChecked()
      expect(screen.getByLabelText("Duplex")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Duplex" })).toBeChecked()
      expect(screen.getByLabelText("Single family house")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Single family house" })).not.toBeChecked()
      expect(screen.getByLabelText("Townhome")).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Townhome" })).not.toBeChecked()
    })
  })

  describe("RentSection", () => {
    const DefaultRentSection = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const {
        register,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
      } = useForm()

      return (
        <RentSection
          register={register}
          getValues={getValues}
          setValue={setValue}
          filterState={{}}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
        />
      )
    }
    const RentSectionWithSelections = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const {
        register,
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
      } = useForm()

      return (
        <RentSection
          register={register}
          getValues={getValues}
          setValue={setValue}
          filterState={{
            [ListingFilterKeys.monthlyRent]: { minRent: "500.00", maxRent: "900.00" },
            [ListingFilterKeys.section8Acceptance]: true,
          }}
          setError={setError}
          clearErrors={clearErrors}
          errors={errors}
        />
      )
    }
    it("should display all fields correctly when an empty filterState is passed", () => {
      render(<DefaultRentSection />)
      expect(screen.getByRole("group", { name: "Rent" })).toBeInTheDocument()
      expect(screen.getByLabelText("Min rent")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Min rent" })).toHaveValue("")
      expect(screen.getByLabelText("Max rent")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Max rent" })).toHaveValue("")
      expect(screen.getByLabelText("Accepts Section 8 Housing Choice Vouchers")).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: "Accepts Section 8 Housing Choice Vouchers" })
      ).not.toBeChecked()
    })

    it("should display all fields correctly when a filterState with previous selections passed", () => {
      render(<RentSectionWithSelections />)
      expect(screen.getByRole("group", { name: "Rent" })).toBeInTheDocument()
      expect(screen.getByLabelText("Min rent")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Min rent" })).toHaveValue("500.00")
      expect(screen.getByLabelText("Max rent")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Max rent" })).toHaveValue("900.00")
      expect(screen.getByLabelText("Accepts Section 8 Housing Choice Vouchers")).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: "Accepts Section 8 Housing Choice Vouchers" })
      ).toBeChecked()
    })
    it("should display error message when min rent is greater than max rent", async () => {
      render(<DefaultRentSection />)
      await userEvent.type(screen.getByRole("textbox", { name: "Min rent" }), "1000.00")
      await userEvent.type(screen.getByRole("textbox", { name: "Max rent" }), "500.00")
      await userEvent.tab()

      expect(
        screen.getByText("Min rent must be less than or equal to max rent")
      ).toBeInTheDocument()
      expect(
        screen.getByText("Max rent must be greater than or equal to min rent")
      ).toBeInTheDocument()
    })
    it("should clear error message when min rent is less than max rent", async () => {
      render(<DefaultRentSection />)
      await userEvent.type(screen.getByRole("textbox", { name: "Min rent" }), "1000.00")
      await userEvent.type(screen.getByRole("textbox", { name: "Max rent" }), "500.00")
      await userEvent.tab()

      expect(
        screen.getByText("Min rent must be less than or equal to max rent")
      ).toBeInTheDocument()

      await userEvent.type(screen.getByRole("textbox", { name: "Max rent" }), "1500.00")
      await userEvent.tab()

      expect(
        screen.queryByText("Min rent must be less than or equal to max rent")
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText("Max rent must be greater than or equal to min rent")
      ).not.toBeInTheDocument()
    })
  })

  describe("SearchSection", () => {
    const DefaultSearchSection = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { register } = useForm()

      return <SearchSection register={register} nameState={""} />
    }
    const SearchSectionWithExistingSearch = () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { register } = useForm()

      return <SearchSection register={register} nameState={"example listing"} />
    }
    it("should display all fields correctly when an empty filterState is passed", () => {
      render(<DefaultSearchSection />)
      expect(screen.getByLabelText("Listing name")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Listing name" })).toHaveValue("")
      expect(screen.getByText("Enter full or partial listing name")).toBeInTheDocument()
    })
    it("should display all fields correctly when a filterState with previous selections is passed", () => {
      render(<SearchSectionWithExistingSearch />)
      expect(screen.getByLabelText("Listing name")).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Listing name" })).toHaveValue("example listing")
      expect(screen.getByText("Enter full or partial listing name")).toBeInTheDocument()
    })
  })
})
