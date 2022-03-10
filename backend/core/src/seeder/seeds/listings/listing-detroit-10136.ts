import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { UnitGroupAmiLevel } from "../../../units-summary/entities/unit-group-ami-level.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "1854 Lafayette",
    zipCode: "48207",
    latitude: 42.339165,
    longitude: -83.030315,
  },
  buildingTotalUnits: 312,
  neighborhood: "Elmwood Park",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10136",
  leasingAgentName: "James Harrigan",
  leasingAgentPhone: "810-750-7000",
  managementCompany: "Independent Management Service",
  managementWebsite: "www.imsproperties.net/michigan",
  name: "Martin Luther King II",
  status: ListingStatus.pending,
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
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: false,
    laundryInBuilding: true,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: false,
    acInUnit: true,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
}

export class Listing10136Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeStudio = await this.unitTypeRepository.findOneOrFail({ name: "studio" })
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = []

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const detroitJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.detroit,
    })

    const unitGroups: Omit<UnitGroup, "id">[] = [
      {
        amiLevels: [],
        unitType: [unitTypeStudio, unitTypeOneBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 2,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 500,
        sqFeetMax: 550,
        openWaitlist: true,
        listing,
        totalAvailable: 2,
      },
      {
        amiLevels: [],
        unitType: [unitTypeOneBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 3,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeThreeBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 3,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: false,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeFourBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 3,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeTwoBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 2,
        maxOccupancy: 6,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeTwoBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 2,
        maxOccupancy: null,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeTwoBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: null,
        maxOccupancy: 2,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeTwoBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 1,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeThreeBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 3,
        maxOccupancy: 3,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeFourBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: null,
        maxOccupancy: null,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
      {
        amiLevels: [],
        unitType: [unitTypeTwoBdrm, unitTypeOneBdrm],
        floorMin: 1,
        floorMax: 5,
        minOccupancy: 1,
        maxOccupancy: 7,
        bathroomMin: 1,
        bathroomMax: 1,
        sqFeetMin: 600,
        sqFeetMax: 600,
        openWaitlist: true,
        listing,
      },
    ]

    const savedUnitGroups = await this.unitGroupRepository.save(unitGroups)

    const MSHDA = await this.amiChartRepository.findOneOrFail({
      name: "MSHDA 2021",
      jurisdiction: detroitJurisdiction,
    })
    const HUD = await this.amiChartRepository.findOneOrFail({
      name: "HUD 2021",
      jurisdiction: detroitJurisdiction,
    })

    await this.unitGroupRepository.save({
      ...savedUnitGroups[0],
      amiLevels: [
        {
          amiChart: MSHDA,
          amiChartId: MSHDA.id,
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 2500,
          unitGroup: savedUnitGroups[0],
        },
        {
          amiChart: HUD,
          amiChartId: HUD.id,
          amiPercentage: 40,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.percentageOfIncome,
          percentageOfIncomeValue: 30,
          unitGroup: savedUnitGroups[0],
        },
      ],
    })

    await this.unitGroupRepository.save({
      ...savedUnitGroups[1],
      amiLevels: [
        {
          amiChart: MSHDA,
          amiChartId: MSHDA.id,
          amiPercentage: 30,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 2500,
          unitGroup: savedUnitGroups[1],
        },
        {
          amiChart: MSHDA,
          amiChartId: MSHDA.id,
          amiPercentage: 40,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.percentageOfIncome,
          percentageOfIncomeValue: 30,
          unitGroup: savedUnitGroups[1],
        },
      ],
    })

    await this.unitGroupRepository.save({
      ...savedUnitGroups[2],
      amiLevels: [
        {
          amiChart: MSHDA,
          amiChartId: MSHDA.id,
          amiPercentage: 55,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.flatRent,
          flatRentValue: 1200,
          unitGroup: savedUnitGroups[2],
        },
      ],
    })

    await this.unitGroupRepository.save({
      ...savedUnitGroups[3],
      amiLevels: [
        {
          amiChart: MSHDA,
          amiChartId: MSHDA.id,
          amiPercentage: 55,
          monthlyRentDeterminationType: MonthlyRentDeterminationType.percentageOfIncome,
          percentageOfIncomeValue: 25,
          unitGroup: savedUnitGroups[3],
        },
      ],
    })

    return listing
  }
}
