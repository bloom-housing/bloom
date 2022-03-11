import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"

const ncpProperty: PropertySeedType = {
  amenities: "Parking, Elevator in Building",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "666 W Bethune St",
    zipCode: "48202",
    latitude: 42.37056,
    longitude: -83.07968,
  },
  buildingTotalUnits: 76,
  neighborhood: "New Center Commons",
  unitAmenities: "Air Conditioning (Wall unit), Garbage Disposal, Range, Refrigerator",
  yearBuilt: 1971,
}

const ncpListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded: "Electricity Included Gas Included Water Included",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10158",
  isWaitlistOpen: false,
  leasingAgentPhone: "313-872-7717",
  managementCompany: "KMG Prestige",
  managementWebsite: "www.kmgprestige.com/communities/",
  name: "New Center Pavilion",
  status: ListingStatus.active,
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
}

export class Listing10158Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...ncpProperty,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "/images/dev/New Center Pavilion.png",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...ncpListing,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const ncpUnitGroupToBeCreated: DeepPartial<UnitGroup>[] = []

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 40,
      listing: listing,
    }
    ncpUnitGroupToBeCreated.push(oneBdrmUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 36,
      listing: listing,
    }
    ncpUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    await this.unitGroupRepository.save(ncpUnitGroupToBeCreated)

    return listing
  }
}
