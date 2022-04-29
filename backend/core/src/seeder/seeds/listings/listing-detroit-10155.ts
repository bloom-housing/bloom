import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "20000 Dequindre St",
    zipCode: "48234",
    latitude: 42.44133,
    longitude: -83.08308,
  },
  buildingTotalUnits: 151,
  neighborhood: "Nolan",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 50,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10155",
  leasingAgentName: "Ryan Beale",
  leasingAgentPhone: "313-366-1616",
  managementCompany: "Premier Property Management",
  name: "Morton Manor",
  status: ListingStatus.active,
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
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: false,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: true,
    grabBars: true,
    heatingInUnit: true,
    acInUnit: true,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.ComingSoon,
  whatToExpect: `<div><strong>Vacant Units</strong>:<div className="mb-3">If you are looking to move in immediately, contact the property and ask if they have any vacant units.</div><div><strong>Waitlists</strong>:<div>If none are vacant, but you are still interested in living at the property in the future, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you will be notified as available units come up.</li></ul>`,
}

export class Listing10155Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = []

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const oneBdrmUnitsSummary: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 150,
      listing: listing,
    }
    await this.unitGroupRepository.save([oneBdrmUnitsSummary])

    return listing
  }
}
