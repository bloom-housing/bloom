import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "1854 Lafayette",
    zipCode: "48207",
    latitude: 42.339165,
    longitude: -83.030315,
  },
  buildingTotalUnits: 312,
  neighborhood: "Elmwood Park",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10136",
  leasingAgentName: "James Harrigan",
  leasingAgentPhone: "810-750-7000",
  managementCompany: "Independent Management Service",
  managementWebsite: "www.imsproperties.net/michigan",
  name: "Martin Luther King II",
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
    wheelchairRamp: true,
    serviceAnimalsAllowed: false,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: false,
    laundryInBuilding: true,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: false,
    acInUnit: true,
  },
}

export class Listing10136Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        // NOTE: this is not an actual picture of the property.
        fileId:
          "https://images.unsplash.com/photo-1595330449916-e7c3e1962bd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1546&q=80",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const studioUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeStudio,
      totalCount: 8,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(studioUnitsSummary)

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 100,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 118,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 54,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    const fourBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeFourBdrm,
      totalCount: 32,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(fourBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return listing
  }
}
