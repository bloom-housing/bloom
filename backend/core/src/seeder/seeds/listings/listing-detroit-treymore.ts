import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"

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
  image: undefined,
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
