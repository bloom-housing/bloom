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
    street: "4000-4100 Blocks Alter Rd & Wayburn St.",
    zipCode: "48224",
    latitude: 42.39175,
    longitude: -82.95057,
  },
  buildingTotalUnits: 64,
  neighborhood: "Morningside",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 50,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10154",
  leasingAgentName: "Kristy Schornak",
  leasingAgentPhone: "313-821-0469",
  managementCompany: "Continental Management",
  managementWebsite: "www.continentalmgt.com",
  name: "Morningside Commons Multi",
  status: ListingStatus.active,
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
}

export class Listing10154Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "/images/dev/Morningside Commons.jpg",
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

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 8,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 38,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    const fourBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeFourBdrm,
      totalCount: 18,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(fourBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return listing
  }
}
