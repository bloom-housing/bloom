import { AssetDtoSeedType, ListingSeedType, PropertySeedType, UnitSeedType } from "./listings"
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
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const nccProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/640-Delaware-Street-Detroit-MI-48202
  amenities: "Parking, Elevator in Building",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "640 Delaware St",
    zipCode: "48202",
    latitude: 42.37273,
    longitude: -83.07981,
  },
  buildingTotalUnits: 71,
  neighborhood: "New Center Commons",
  petPolicy: "No Pets Allowed",
  unitAmenities: "Air Conditioning Dishwasher Garbage Disposal Range Refrigerator",
  unitsAvailable: 5,
  yearBuilt: 1929,
}

const nccUnits: Array<UnitSeedType> = [
  {
    // Monthly rent is actually represented as a range, but must be a number for an individual unit.
    monthlyRent: "497",
    numBathrooms: 1,
    numBedrooms: 0,
    sqFeet: "550",
    status: UnitStatus.available,
  },
  {
    monthlyRent: "650",
    numBathrooms: 1,
    numBedrooms: 1,
    sqFeet: "800",
    status: UnitStatus.available,
  },
  {
    monthlyRent: "675",
    numBathrooms: 1,
    numBedrooms: 1,
    sqFeet: "1000",
    status: UnitStatus.available,
  },
  {
    monthlyRent: "750",
    numBathrooms: 1,
    numBedrooms: 2,
    sqFeet: "900",
    status: UnitStatus.available,
  },
  {
    monthlyRent: "894",
    numBathrooms: 1,
    numBedrooms: 2,
    sqFeet: "1100",
    status: UnitStatus.available,
  },
]

const studioUnit: UnitSeedType = {
  numBedrooms: 0,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 10; i++) {
  nccUnits.push(studioUnit)
}

const oneBdrmUnit: UnitSeedType = {
  numBedrooms: 1,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 20; i++) {
  nccUnits.push(oneBdrmUnit)
}

const twoBdrmUnit = {
  numBedrooms: 2,
  status: UnitStatus.occupied,
}

for (let i = 0; i < 10; i++) {
  nccUnits.push(twoBdrmUnit)
}

const nccListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationFee: "25",
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded:
    "Water Included Resident Pays Electricity Resident Pays Gas Resident Pays Heat(Heat is gas.)",
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: false,
  displayWaitlistSize: false,
  hrdId: "HRD10157",
  leasingAgentPhone: "313-873-1022",
  managementCompany: "KMG Prestige",
  managementWebsite: "www.kmgprestige.com/communities/",
  name: "New Center Commons",
  status: ListingStatus.active,
}

export class Listing10157Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...nccProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = nccUnits.map((unit) => {
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
      externalReference: nccListing.managementWebsite,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "https://s3.amazonaws.com/photos.rentlinx.com/L800/4275662.jpg",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...nccListing,
      applicationMethods: [applicationMethod],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      preferences: [],
    }

    const nccUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const zeroBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeStudio,
      totalCount: 1,
      monthlyRent: "$470",
      property: property,
      sqFeetMax: "550",
    }
    nccUnitsSummaryToBeCreated.push(zeroBdrmUnitsSummary)

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 2,
      monthlyRent: "$650",
      property: property,
      sqFeetMin: "800",
      sqFeetMax: "1000",
    }
    nccUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 2,
      monthlyRent: "$750",
      property: property,
      sqFeetMin: "900",
      sqFeetMax: "1100",
    }
    nccUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(nccUnitsSummaryToBeCreated)

    return await this.listingRepository.save(listingCreateDto)
  }
}
