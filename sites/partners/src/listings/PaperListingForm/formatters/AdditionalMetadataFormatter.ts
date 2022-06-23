import { ListingMarketingTypeEnum, ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { listingFeatures, listingUtilities } from "@bloom-housing/shared-helpers"
import Formatter from "./Formatter"

export default class AdditionalMetadataFormatter extends Formatter {
  /** Format a final set of various values */
  process() {
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
    if (!this.data.reservedCommunityType?.id) this.data.reservedCommunityType = null
    this.data.reviewOrderType =
      this.data.reviewOrderQuestion === "reviewOrderLottery"
        ? ListingReviewOrder.lottery
        : ListingReviewOrder.firstComeFirstServe

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
    if (this.data.marketingType === ListingMarketingTypeEnum.marketing) {
      this.data.whatToExpect = `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`
      this.data.whatToExpectAdditionalText = `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`
    } else {
      this.data.whatToExpect = `This property is still under development by the property owners. If you sign up for notifications through Detroit Home Connect, we will send you updates when this property has opened up applications for residents. You can also check back later to this page for updates.`
      this.data.whatToExpectAdditionalText = null
    }
  }
}
