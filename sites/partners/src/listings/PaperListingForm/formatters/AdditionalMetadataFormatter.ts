import { ListingReviewOrder } from "@bloom-housing/backend-core/types"
import Formatter from "./Formatter"

export default class AdditionalMetadataFormatter extends Formatter {
  /** Format a final set of various values */
  process() {
    this.data.listingPreferences = this.metadata.preferences.map((preference, index) => {
      return { preference, ordinal: index + 1 }
    })
    this.data.listingPrograms = this.metadata.programs.map((program, index) => {
      return { program: { ...program }, ordinal: index + 1 }
    })

    if (this.data.buildingAddress) {
      this.data.buildingAddress = {
        ...this.data.buildingAddress,
        latitude: this.metadata.latLong.latitude ?? null,
        longitude: this.metadata.latLong.longitude ?? null,
      }
    }

    this.data.customMapPin = this.metadata.customMapPositionChosen
    this.data.yearBuilt = this.data.yearBuilt ? Number(this.data.yearBuilt) : null
    if (!this.data.reservedCommunityType.id) this.data.reservedCommunityType = null
    this.data.reviewOrderType =
      this.data.reviewOrderQuestion === "reviewOrderLottery"
        ? ListingReviewOrder.lottery
        : ListingReviewOrder.firstComeFirstServe
  }
}
