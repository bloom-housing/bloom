import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

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
        // NOTE: this is not an actual image of the property
        fileId:
          "https://images.unsplash.com/photo-1612637968894-660373e23b03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
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

    const mcvUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 28,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 142,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 24,
      listing: listing,
    }
    mcvUnitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(mcvUnitsSummaryToBeCreated)

    return listing
  }
}
