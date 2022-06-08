import { ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

const treymoreProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/457-Brainard-Street-Detroit-MI-48201
  amenities: "Parking, Elevator in Building, Community Room",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "457 Brainard St",
    zipCode: "48201",
    latitude: 42.3461357,
    longitude: -83.0645436,
  },
  petPolicy: "No Pets Allowed",
  unitAmenities:
    "Air Conditioning (Central Air Conditioning), Garbage Disposal, Range, Refrigerator, Coin Laundry Room in building",
  unitsAvailable: 4,
  yearBuilt: 1916,
  accessibility: "2 units are barrier free; 2 units are bi-level 1.5 bath",
}

const treymoreListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded: "Water Included Resident Pays Electricity Resident Pays Gas Resident Pays Heat",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  isWaitlistOpen: false,
  leasingAgentPhone: "313-462-4123",
  managementCompany: "KMG Prestige",
  managementWebsite: "http://rentlinx.kmgprestige.com/Company.aspx?CompanyID=107",
  name: "Treymore Apartments",
  status: ListingStatus.pending,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  leasingAgentName: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  features: {
    elevator: false,
    wheelchairRamp: false,
    serviceAnimalsAllowed: false,
    accessibleParking: false,
    parkingOnSite: false,
    inUnitWasherDryer: false,
    laundryInBuilding: false,
    barrierFreeEntrance: false,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: false,
    acInUnit: false,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
}

export class ListingTreymoreSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...treymoreProperty,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...treymoreListing,
      applicationMethods: [],
      assets: [],
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const treymoreUnitGroupToBeCreated: DeepPartial<UnitGroup>[] = []

    const studioUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeStudio],
      totalCount: 2,
      listing: listing,
      totalAvailable: 0,
    }
    treymoreUnitGroupToBeCreated.push(studioUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 4,
      amiLevels: [
        {
          amiPercentage: 10,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 707,
        },
      ],
      listing: listing,
      sqFeetMin: 720,
      sqFeetMax: 1003,
      totalAvailable: 4,
    }
    treymoreUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    await this.unitGroupRepository.save(treymoreUnitGroupToBeCreated)

    return listing
  }
}
