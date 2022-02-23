import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummary } from "../../units-summary/entities/units-summary.entity"

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
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10202",
  leasingAgentName: "Janelle Henderson",
  leasingAgentPhone: "313-824-2244",
  managementCompany: "Associated Management Co",
  managementWebsite: "associated-management.rentlinx.com/listings",
  name: "River Towers",
  status: ListingStatus.pending,
  image: undefined,
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
}

export class Listing10202Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...mcvProperty,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "https://s3.amazonaws.com/photos.rentlinx.com/L800/85883803.jpg",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mcvListing,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mcvUnitsSummaryToBeCreated: DeepPartial<UnitsSummary>[] = []

    const oneBdrmUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 376,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 96,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(mcvUnitsSummaryToBeCreated)

    return listing
  }
}
