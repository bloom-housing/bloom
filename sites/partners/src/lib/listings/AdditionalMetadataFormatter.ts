import { listingFeatures, listingUtilities } from "@bloom-housing/shared-helpers"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
    if (!this.data.reservedCommunityTypes?.id) this.data.reservedCommunityTypes = null
    this.data.reviewOrderType =
      this.data.reviewOrderQuestion === "reviewOrderLottery"
        ? ReviewOrderTypeEnum.lottery
        : ReviewOrderTypeEnum.firstComeFirstServe

    if (this.data.reviewOrderType !== ReviewOrderTypeEnum.lottery) {
      this.data.lotteryOptIn = null
    } else {
      if (this.data.lotteryOptIn === null) delete this.data.lotteryOptIn
    }

    if (this.data.listingAvailabilityQuestion === "openWaitlist") {
      this.data.reviewOrderType = ReviewOrderTypeEnum.waitlist
    }

    if (this.data.listingFeatures) {
      this.data.listingFeatures = listingFeatures.reduce((acc, current) => {
        return {
          ...acc,
          [current]: this.data.listingFeatures && this.data.listingFeatures[current],
        }
      }, {})
    }
    if (this.data.listingUtilities) {
      this.data.listingUtilities = listingUtilities.reduce((acc, current) => {
        return {
          ...acc,
          [current]: this.data.listingUtilities && this.data.listingUtilities[current],
        }
      }, {})
    }
  }
}
