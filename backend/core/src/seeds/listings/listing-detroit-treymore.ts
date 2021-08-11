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

const treymoreProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/457-Brainard-Street-Detroit-MI-48201
  amenities: "Parking Elevator in Building (Community Room)",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "457 Brainard St",
    zipCode: "48201",
    latitude: 42.3461357,
    longitude: -83.0645436,
  },
  petPolicy: "No Pets Allowed",
  unitAmenities:
    "Air Conditioning(Central Air Conditioning) Garbage Disposal Range Refrigerator (Coin Laundry Room in building)",
  unitsAvailable: 4,
  yearBuilt: 1916,
}

const treymoreUnits: Array<UnitSeedType> = [
  {
    numBathrooms: 1,
    numBedrooms: 0,
    status: UnitStatus.occupied,
  },
  {
    numBathrooms: 1,
    numBedrooms: 1,
    status: UnitStatus.occupied,
  },
  {
    // Monthly rent is actually represented as a range, but must be a number for an individual unit.
    monthlyRent: "707",
    numBathrooms: 1,
    numBedrooms: 2,
    status: UnitStatus.available,
  },
  {
    monthlyRent: "819",
    numBathrooms: 1,
    numBedrooms: 2,
    status: UnitStatus.available,
  },
  {
    monthlyRent: "707",
    numBathrooms: 1,
    numBedrooms: 2,
    status: UnitStatus.available,
  },
  {
    monthlyRent: "819",
    numBathrooms: 1,
    numBedrooms: 2,
    status: UnitStatus.available,
  },
]

const treymoreListing: ListingSeedType = {
  applicationAddress: {
    city: "Detroit",
    state: "MI",
    street: "2140 Martin Luther King Jr Blvd",
    zipCode: "48208",
  },
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded: "Water Included Resident Pays Electricity Resident Pays Gas Resident Pays Heat",
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  isWaitlistOpen: true,
  leasingAgentPhone: "313-462-4123",
  managementCompany: "KMG Prestige",
  managementWebsite: "http://rentlinx.kmgprestige.com/Company.aspx?CompanyID=107",
  name: "Treymore Apartments",
  status: ListingStatus.active,
}

export class ListingTreymoreSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...treymoreProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = treymoreUnits.map(
      (unit) => {
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
      }
    )
    await this.unitsRepository.save(unitsToBeCreated)
    const applicationMethod: ApplicationMethod = await this.applicationMethodRepository.save({
      type: ApplicationMethodType.ExternalLink,
      acceptsPostmarkedApplications: false,
      externalReference: treymoreListing.managementWebsite,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "https://s3.amazonaws.com/photos.rentlinx.com/L800/51354687.jpg",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...treymoreListing,
      applicationMethods: [applicationMethod],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      preferences: [],
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}
