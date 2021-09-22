import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
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

const nccListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationFee: "25",
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded:
    "Water Included, Resident Pays Electricity, Resident Pays Gas, Resident Pays Heat(Heat is gas.)",
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
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

    const property = await this.propertyRepository.save({
      ...nccProperty,
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
      applicationMethods: [],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const nccUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const zeroBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeStudio,
      totalCount: 1,
      monthlyRentMin: 470,
      listing: listing,
      sqFeetMax: "550",
    }
    nccUnitsSummaryToBeCreated.push(zeroBdrmUnitsSummary)

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 2,
      monthlyRentMin: 650,
      listing: listing,
      sqFeetMin: "800",
      sqFeetMax: "1000",
    }
    nccUnitsSummaryToBeCreated.push(oneBdrmUnitsSummary)

    const twoBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeTwoBdrm,
      totalCount: 2,
      monthlyRentMin: 750,
      listing: listing,
      sqFeetMin: "900",
      sqFeetMax: "1100",
    }
    nccUnitsSummaryToBeCreated.push(twoBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(nccUnitsSummaryToBeCreated)

    return listing
  }
}
