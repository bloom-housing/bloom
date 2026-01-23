import {
  allListingFeatures,
  listingRequiredDocumentsOptions,
  listingUtilities,
} from "@bloom-housing/shared-helpers"
import {
  ReviewOrderTypeEnum,
  YesNoEnum,
  EnumListingListingType,
  EnumListingDepositType,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Formatter from "./Formatter"

export default class AdditionalMetadataFormatter extends Formatter {
  /** Format a final set of various values */
  process() {
    const preferences = this.metadata.preferences.map((preference, index) => {
      return {
        multiselectQuestions: preference,
        ordinal: index + 1,
        id: preference.id,
        listingId: this.data.id,
      }
    })
    const programs =
      this.metadata.programs?.map((program, index) => {
        return {
          multiselectQuestions: program,
          ordinal: index + 1,
          id: program.id,
          listingId: this.data.id,
        }
      }) || []

    this.data.listingMultiselectQuestions = [...preferences, ...programs]

    if (this.data.listingsBuildingAddress) {
      this.data.listingsBuildingAddress = {
        ...this.data.listingsBuildingAddress,
        latitude: this.metadata.latLong.latitude ?? null,
        longitude: this.metadata.latLong.longitude ?? null,
      }
    }

    const cleanAddress = (fieldName: string) => {
      if (this.data[fieldName]) {
        delete this.data[fieldName].id
        if (
          !this.data[fieldName].street &&
          !this.data[fieldName].city &&
          !this.data[fieldName].state &&
          !this.data[fieldName].zipCode
        ) {
          this.data[fieldName] = null
        }
      }
    }

    cleanAddress("leasingAgentAddress")
    cleanAddress("buildingAddress")
    cleanAddress("listingsApplicationMailingAddress")
    cleanAddress("listingsApplicationPickUpAddress")
    cleanAddress("listingsApplicationDropOffAddress")

    this.data.customMapPin = this.metadata.customMapPositionChosen
    this.data.yearBuilt = this.data.yearBuilt ? Number(this.data.yearBuilt) : null
    if (!this.data.reservedCommunityTypes?.id) {
      this.data.reservedCommunityTypes = null
      this.data.includeCommunityDisclaimer = null
      this.data.communityDisclaimerTitle = ""
      this.data.communityDisclaimerDescription = ""
    } else if (this.data.includeCommunityDisclaimerQuestion === YesNoEnum.no) {
      this.data.communityDisclaimerTitle = ""
      this.data.communityDisclaimerDescription = ""
    }
    this.data.reviewOrderType =
      this.data.reviewOrderQuestion === "reviewOrderLottery"
        ? ReviewOrderTypeEnum.lottery
        : ReviewOrderTypeEnum.firstComeFirstServe

    if (
      this.data.listingAvailabilityQuestion === "openWaitlist" &&
      !this.metadata.enableUnitGroups
    ) {
      this.data.reviewOrderType =
        this.data.reviewOrderType === ReviewOrderTypeEnum.lottery
          ? ReviewOrderTypeEnum.waitlistLottery
          : ReviewOrderTypeEnum.waitlist
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStringArray = (value: any): value is string[] => {
      return Object.keys(value).every((key) => {
        return !Array.isArray(value[key])
      })
    }

    if (
      this.data.configurableAccessibilityFeatures &&
      isStringArray(this.data.configurableAccessibilityFeatures)
    ) {
      // No categories - form data is a string array
      const updatedFeatures = allListingFeatures.reduce((acc, current) => {
        const values = this.data.configurableAccessibilityFeatures as string[]
        const isSelected = values.some((feature) => {
          // Remove `configurableAccessibilityFeatures.` prefix from form
          const prefixIndex = feature.indexOf(".") + 1
          return feature.substring(prefixIndex) === current
        })
        return {
          ...acc,
          [current]: isSelected,
        }
      }, {})
      this.data.listingFeatures = updatedFeatures
    } else if (this.data.configurableAccessibilityFeatures) {
      // Categories - form data is an object of string arrays by category
      const flattenedFeatures = Object.values(this.data.configurableAccessibilityFeatures).flat()
      const updatedFeatures = allListingFeatures.reduce((acc, current) => {
        const isSelected = flattenedFeatures.some((feature) => feature === current)
        return {
          ...acc,
          [current]: isSelected,
        }
      }, {})
      this.data.listingFeatures = updatedFeatures
    }
    if (!this.data.configurableAccessibilityFeatures) {
      const updatedFeatures = allListingFeatures.reduce((acc, current) => {
        return {
          ...acc,
          [current]: false,
        }
      }, {})
      this.data.listingFeatures = updatedFeatures
    }

    if (
      this.data.selectedRequiredDocuments &&
      this.data.listingType === EnumListingListingType.nonRegulated
    ) {
      this.data.requiredDocumentsList = listingRequiredDocumentsOptions.reduce((acc, current) => {
        const isSelected = this.data.selectedRequiredDocuments.some(
          (document) => document === current
        )
        return {
          ...acc,
          [current]: isSelected,
        }
      }, {})
    } else {
      this.data.requiredDocumentsList = null
    }

    if (this.data.utilities) {
      this.data.listingUtilities = listingUtilities.reduce((acc, current) => {
        const isSelected = this.data.utilities.some((utility) => utility === current)
        return {
          ...acc,
          [current]: isSelected,
        }
      }, {})
    }

    if (this.data.petPolicyPreferences) {
      this.data.allowsDogs = this.data.petPolicyPreferences.includes("allowsDogs")
      this.data.allowsCats = this.data.petPolicyPreferences.includes("allowsCats")
    }

    if (!this.data.listingType || this.data.listingType === EnumListingListingType.regulated) {
      this.data.depositValue = undefined
    } else if (this.data.listingType === EnumListingListingType.nonRegulated) {
      if (this.data.depositType === EnumListingDepositType.fixedDeposit) {
        this.data.depositMin = null
        this.data.depositMax = null
      } else {
        this.data.depositValue = null
      }
    }
  }
}
