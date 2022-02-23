import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummary } from "../../units-summary/entities/units-summary.entity"

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
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10145",
  leasingAgentName: "Janelle Henderson",
  leasingAgentPhone: "313-831-1725",
  managementCompany: "Associated Management Co",
  managementWebsite: "associated-management.rentlinx.com/listings",
  name: "Medical Center Village",
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

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://images.squarespace-cdn.com/content/v1/5e7510a49787c5207b777036/1588191604480-OSLU4ZCW3CHUQH0B2ERS/Medical+Center+Village.jpg?format=750w",
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
      reservedCommunityType: reservedType,
      // If a reservedCommunityType is specified, a reservedCommunityDescription MUST also be specified
      reservedCommunityDescription: "",
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mcvUnitsSummaryToBeCreated: Array<DeepPartial<UnitsSummary>> = []

    const oneBdrmUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 28,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 142,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    const threeBdrmUnitsSummary: DeepPartial<UnitsSummary> = {
      unitType: [unitTypeThreeBdrm],
      totalCount: 24,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(mcvUnitsSummaryToBeCreated)

    return listing
  }
}
