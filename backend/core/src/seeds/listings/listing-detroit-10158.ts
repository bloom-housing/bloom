import { ListingSeedType, PropertySeedType, UnitSeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ApplicationMethod } from "../../application-methods/entities/application-method.entity"
import { ApplicationMethodType } from "../../application-methods/types/application-method-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

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
  unitAmenities: "Air Conditioning(Wall unit) Garbage Disposal Range Refrigerator",
  yearBuilt: 1971,
}

const ncpUnits: Array<UnitSeedType> = []

const oneBdrmUnit: UnitSeedType = {
  numBedrooms: 1,
  numBathrooms: 1,
  sqFeet: "500",
  status: UnitStatus.occupied,
}

for (let i = 0; i < 40; i++) {
  ncpUnits.push(oneBdrmUnit)
}

const twoBdrmUnit = {
  numBedrooms: 2,
  numBathrooms: 1,
  sqFeet: "650",
  status: UnitStatus.occupied,
}

for (let i = 0; i < 36; i++) {
  ncpUnits.push(twoBdrmUnit)
}

const ncpListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded: "Electricity Included Gas Included Water Included",
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10158",
  isWaitlistOpen: true,
  leasingAgentPhone: "313-872-7717",
  managementCompany: "KMG Prestige",
  managementWebsite: "www.kmgprestige.com/communities/",
  name: "New Center Pavilion",
  status: ListingStatus.active,
}

export class Listing10158Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...ncpProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = ncpUnits.map((unit) => {
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
          unitType = unitTypeOneBdrm
          break
        default:
          unitType = unitTypeStudio
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
      externalReference: ncpListing.managementWebsite,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...ncpListing,
      applicationMethods: [applicationMethod],
      assets: [],
      events: [],
      property: property,
      preferences: [],
    }

    const ncpUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 40,
      monthlyRent: "$0",
      property: property,
    }
    ncpUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 36,
      monthlyRent: "$0",
      property: property,
    }
    ncpUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(ncpUnitsSummaryToBeCreated)

    return await this.listingRepository.save(listingCreateDto)
  }
}
