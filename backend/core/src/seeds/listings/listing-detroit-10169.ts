import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const grandRivProperty: PropertySeedType = {
  // See http://rentlinx.kmgprestige.com/640-Delaware-Street-Detroit-MI-48202
  amenities: "Parking, Elevator in Building",
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "28 W. Grand River",
    zipCode: "48226",
    latitude: 42.334007,
    longitude: -83.04893,
  },
  buildingTotalUnits: 175,
  neighborhood: "Downtown",
  petPolicy: "No Pets Allowed",
  unitAmenities: "Air Conditioning, Dishwasher, Garbage Disposal, Range, Refrigerator",
  unitsAvailable: 5,
  yearBuilt: 1929,
}

const grandRivListing: ListingSeedType = {
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
  leasingAgentPhone: "313-545-8720",
  managementCompany: "Rock Management Company",
  managementWebsite: "www.28granddetroit.com",
  name: "Capitol Park Micro Units",
  status: ListingStatus.pending,
  image: undefined,
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  leasingAgentName: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  isWaitlistOpen: undefined,
  features: {
    elevator: true,
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: false,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: true,
    grabBars: true,
    heatingInUnit: true,
    acInUnit: true,
  },
}

export class Listing10157Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const property = await this.propertyRepository.save({
      ...grandRivProperty,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://cdngeneralcf.rentcafe.com/dmslivecafe/3/601734/01_Home_Hero_28G.jpg?quality=85&scale=both&",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...grandRivListing,
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
