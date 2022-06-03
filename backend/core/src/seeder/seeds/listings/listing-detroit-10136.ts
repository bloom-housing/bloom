import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { UnitGroupAmiLevel } from "../../../units-summary/entities/unit-group-ami-level.entity"
import { MonthlyRentDeterminationType } from "../../../units-summary/types/monthly-rent-determination.enum"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

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
  managementWebsite: "https://www.imsproperties.net/michigan",
  name: "Martin Luther King II",
  status: ListingStatus.pending,
  images: [],
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
    elevator: false,
    wheelchairRamp: false,
    serviceAnimalsAllowed: false,
    accessibleParking: false,
    parkingOnSite: false,
    inUnitWasherDryer: false,
    laundryInBuilding: false,
    barrierFreeEntrance: false,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: false,
    acInUnit: false,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
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

    const unitGroups: Omit<UnitGroup, "id" | "listingId">[] = [
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
