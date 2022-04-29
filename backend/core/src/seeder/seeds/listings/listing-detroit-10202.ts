import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

//
const mcvProperty: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "7800 E Jefferson Ave",
    zipCode: "48214",
    latitude: 42.35046,
    longitude: -82.99615,
  },
  buildingTotalUnits: 469,
  neighborhood: "Gold Coast",
}

const mcvListing: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: null,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10202",
  leasingAgentName: "Janelle Henderson",
  leasingAgentPhone: "313-824-2244",
  managementCompany: "Associated Management Co",
  managementWebsite: "https://associated-management.rentlinx.com/listings",
  name: "River Towers",
  status: ListingStatus.pending,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  isWaitlistOpen: undefined,
  features: {
    elevator: true,
    wheelchairRamp: false,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: true,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: true,
    acInUnit: true,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><strong>Vacant Units</strong>:<div className="mb-3">If you are looking to move in immediately, contact the property and ask if they have any vacant units.</div><div><strong>Waitlists</strong>:<div>If none are vacant, but you are still interested in living at the property in the future, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you will be notified as available units come up.</li></ul>`,
}

export class Listing10202Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...mcvProperty,
    })

    const assets: Array<AssetDtoSeedType> = []

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mcvListing,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mcvUnitGroupToBeCreated: DeepPartial<UnitGroup>[] = []

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 376,
      listing: listing,
    }
    mcvUnitGroupToBeCreated.push(oneBdrmUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 96,
      listing: listing,
    }
    mcvUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    await this.unitGroupRepository.save(mcvUnitGroupToBeCreated)

    return listing
  }
}
