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

const mshUnits: Array<UnitSeedType> = []

const threeBdrmUnit = {
  numBedrooms: 3,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 9; i++) {
  mshUnits.push(threeBdrmUnit)
}

const fourBdrmUnit = {
  numBedrooms: 4,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 15; i++) {
  mshUnits.push(fourBdrmUnit)
}

assert(mshUnits.length === mshProperty.buildingTotalUnits)

const mshListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10147",
  leasingAgentName: "Kim Hagood",
  leasingAgentPhone: "248-228-1340",
  managementCompany: "Elite Property Management LLC",
  managementWebsite: "www.elitep-m.com",
  name: "Melrose Square Homes",
  status: ListingStatus.active,
}

export class Listing10147Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...mshProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = mshUnits.map((unit) => {
      let unitType
      switch (unit.numBedrooms) {
        case 4:
          unitType = unitTypeFourBdrm
          break
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
      externalReference: mshListing.managementWebsite,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mshListing,
      applicationMethods: [applicationMethod],
      assets: [],
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mshUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const fourBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeFourBdrm,
      totalCount: 15,
      listing: listing,
    }
    mshUnitsSummaryToBeCreated.push(fourBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 9,
      listing: listing,
    }
    mshUnitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(mshUnitsSummaryToBeCreated)

    return listing
  }
}
