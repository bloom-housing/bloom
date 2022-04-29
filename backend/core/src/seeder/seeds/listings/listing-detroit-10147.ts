import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

const mshProperty: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "7335 Melrose St",
    zipCode: "48211",
    latitude: 42.37442,
    longitude: -83.06363,
  },
  buildingTotalUnits: 24,
  neighborhood: "North End",
}

const mshListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10147",
  leasingAgentName: "Kim Hagood",
  leasingAgentPhone: "248-228-1340",
  managementCompany: "Elite Property Management LLC",
  managementWebsite: "https://www.elitep-m.com",
  name: "Melrose Square Homes",
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
    elevator: false,
    wheelchairRamp: true,
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

export class Listing10147Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...mshProperty,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mshListing,
      applicationMethods: [],
      assets: [],
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mshUnitGroupToBeCreated: Array<DeepPartial<UnitGroup>> = []

    const fourBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeFourBdrm],
      totalCount: 15,
      listing: listing,
    }
    mshUnitGroupToBeCreated.push(fourBdrmUnitGroup)

    const threeBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeThreeBdrm],
      totalCount: 9,
      listing: listing,
    }
    mshUnitGroupToBeCreated.push(threeBdrmUnitGroup)

    await this.unitGroupRepository.save(mshUnitGroupToBeCreated)

    return listing
  }
}
