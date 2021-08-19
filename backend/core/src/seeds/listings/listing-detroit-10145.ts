import { ListingSeedType, PropertySeedType, UnitSeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ApplicationMethodType } from "../../application-methods/types/application-method-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { ApplicationMethod } from "../../application-methods/entities/application-method.entity"
import assert from "assert"
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

const mcvUnits: Array<UnitSeedType> = []

const oneBdrmUnit: UnitSeedType = {
  numBedrooms: 1,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 28; i++) {
  mcvUnits.push(oneBdrmUnit)
}

const twoBdrmUnit = {
  numBedrooms: 2,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 142; i++) {
  mcvUnits.push(twoBdrmUnit)
}

const threeBdrmUnit = {
  numBedrooms: 3,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 24; i++) {
  mcvUnits.push(threeBdrmUnit)
}

assert(mcvUnits.length === mcvProperty.buildingTotalUnits)

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
}

export class Listing10145Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const property = await this.propertyRepository.save({
      ...mcvProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = mcvUnits.map((unit) => {
      let unitType
      switch (unit.numBedrooms) {
        case 3:
          unitType = unitTypeThreeBdrm
          break
        case 2:
          unitType = unitTypeTwoBdrm
          break
        case 1:
        // falls through
        default:
          unitType = unitTypeOneBdrm
      }
      return {
        ...unit,
        unitType: unitType,
        property: {
          id: property.id,
        },
      }
    })

    await this.unitsRepository.save(unitsToBeCreated)
    const applicationMethod: ApplicationMethod = await this.applicationMethodRepository.save({
      type: ApplicationMethodType.ExternalLink,
      acceptsPostmarkedApplications: false,
      externalReference: mcvListing.managementWebsite,
    })
    const reservedType = await this.reservedTypeRepository.findOneOrFail({ name: "senior62" })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mcvListing,
      applicationMethods: [applicationMethod],
      assets: [],
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
