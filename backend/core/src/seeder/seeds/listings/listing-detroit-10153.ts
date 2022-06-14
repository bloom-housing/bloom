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
    street: "12026 Morang",
    zipCode: "48224",
    latitude: 42.42673,
    longitude: -82.95126,
  },
  buildingTotalUnits: 40,
  neighborhood: "Moross-Morang",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10153",
  leasingAgentPhone: "313-999-1268",
  managementCompany: "Smiley Management",
  name: "Morang Apartments",
  status: ListingStatus.active,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  section8acceptance: true,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  leasingAgentName: undefined,
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
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
}

export class Listing10153Seed extends ListingDefaultSeed {
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

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 40,
      listing: listing,
    }

    await this.unitGroupRepository.save([oneBdrmUnitGroup])

    return listing
  }
}
