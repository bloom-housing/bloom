import { ListingReviewOrder, ListingAvailability } from "@bloom-housing/backend-core/types"
import { listingFeatures, listingUtilities } from "@bloom-housing/shared-helpers"
import Formatter from "./Formatter"

export default class AdditionalMetadataFormatter extends Formatter {
  /** Format a final set of various values */
  process() {
    const preferences = this.metadata.preferences.map((preference, index) => {
      return { multiselectQuestion: preference, ordinal: index + 1 }
    })
    const programs = this.metadata.programs.map((program, index) => {
      return { multiselectQuestion: program, ordinal: index + 1 }
    })

    this.data.listingMultiselectQuestions = { ...preferences, ...programs }

    if (this.data.buildingAddress) {
      this.data.buildingAddress = {
        ...this.data.buildingAddress,
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
    cleanAddress("applicationMailingAddress")
    cleanAddress("applicationPickUpAddress")
    cleanAddress("applicationDropOffAddress")

    this.data.customMapPin = this.metadata.customMapPositionChosen
    this.data.yearBuilt = this.data.yearBuilt ? Number(this.data.yearBuilt) : null
    if (!this.data.reservedCommunityType.id) this.data.reservedCommunityType = null
    this.data.reviewOrderType =
      this.data.reviewOrderQuestion === "reviewOrderLottery"
        ? ListingReviewOrder.lottery
        : ListingReviewOrder.firstComeFirstServe

    if (this.data.listingAvailabilityQuestion === "availableUnits") {
      this.data.listingAvailability = ListingAvailability.availableUnits
    } else if (this.data.listingAvailabilityQuestion === "openWaitlist") {
      this.data.listingAvailability = ListingAvailability.openWaitlist
    }
    this.data.features = listingFeatures.reduce((acc, current) => {
      return {
        ...acc,
        [current]: this.data.listingFeatures && this.data.listingFeatures.indexOf(current) >= 0,
      }
    }, {})
    this.data.utilities = listingUtilities.reduce((acc, current) => {
      return {
        ...acc,
        [current]: this.data.listingUtilities && this.data.listingUtilities.indexOf(current) >= 0,
      }
    }, {})
  }
}
