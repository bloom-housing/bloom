import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

const mcvProperty: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "4701 Chrysler Drive",
    zipCode: "48201",
    latitude: 42.35923,
    longitude: -83.054134,
  },
  buildingTotalUnits: 194,
  neighborhood: "Forest Park",
}

const mcvListing: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: null,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10145",
  leasingAgentName: "Janelle Henderson",
  leasingAgentPhone: "313-831-1725",
  managementCompany: "Associated Management Co",
  managementWebsite: "https://associated-management.rentlinx.com/listings",
  name: "Medical Center Village",
  status: ListingStatus.active,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  section8Acceptance: true,
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
    serviceAnimalsAllowed: false,
    accessibleParking: false,
    parkingOnSite: false,
    inUnitWasherDryer: false,
    laundryInBuilding: true,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: false,
    acInUnit: true,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
}

export class Listing10145Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const property = await this.propertyRepository.save({
      ...mcvProperty,
    })

    const reservedType = await this.reservedTypeRepository.findOneOrFail({ name: "senior62" })

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
      reservedCommunityType: reservedType,
      // If a reservedCommunityType is specified, a reservedCommunityDescription MUST also be specified
      reservedCommunityDescription: "",
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mcvUnitGroupToBeCreated: Array<DeepPartial<UnitGroup>> = []

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 28,
      listing: listing,
    }
    mcvUnitGroupToBeCreated.push(oneBdrmUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 142,
      listing: listing,
    }
    mcvUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    const threeBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeThreeBdrm],
      totalCount: 24,
      listing: listing,
    }
    mcvUnitGroupToBeCreated.push(threeBdrmUnitGroup)

    await this.unitGroupRepository.save(mcvUnitGroupToBeCreated)

    return listing
  }
}
