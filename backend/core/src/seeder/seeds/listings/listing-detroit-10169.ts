import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { getDate } from "./shared"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"

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
  applicationOpenDate: getDate(1000),
  applicationDueDate: getDate(1500),
  applicationFee: "25",
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  costsNotIncluded:
    "Water Included, Resident Pays Electricity, Resident Pays Gas, Resident Pays Heat(Heat is gas.)",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10157",
  leasingAgentPhone: "313-545-8720",
  managementCompany: "Rock Management Company",
  managementWebsite: "www.28granddetroit.com",
  name: "Capitol Park Micro Units",
  status: ListingStatus.active,
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
  listingPreferences: [],
  jurisdictionName: "Detroit",
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
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const nccUnitGroupToBeCreated: DeepPartial<UnitGroup>[] = []

    const zeroBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeStudio],
      totalCount: 1,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 470,
        },
      ],
      listing: listing,
      sqFeetMax: 550,
    }
    nccUnitGroupToBeCreated.push(zeroBdrmUnitGroup)

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 2,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 650,
        },
      ],
      listing: listing,
      sqFeetMin: 800,
      sqFeetMax: 1000,
    }
    nccUnitGroupToBeCreated.push(oneBdrmUnitGroup)

    const twoBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeTwoBdrm],
      totalCount: 2,
      amiLevels: [
        {
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 750,
        },
      ],
      listing: listing,
      sqFeetMin: 900,
      sqFeetMax: 1100,
    }
    nccUnitGroupToBeCreated.push(twoBdrmUnitGroup)

    await this.unitGroupRepository.save(nccUnitGroupToBeCreated)

    return listing
  }
}
