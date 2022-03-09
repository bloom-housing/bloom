import { InjectRepository } from "@nestjs/typeorm"
import { BaseEntity, DeepPartial, Repository } from "typeorm"

import {
  getDefaultAssets,
  getDefaultListing,
  getDefaultListingEvents,
  getDefaultProperty,
  getDefaultUnits,
  getDisabilityOrMentalIllnessProgram,
  getDisplaceePreference,
  getHousingSituationProgram,
  getLiveWorkPreference,
  getServedInMilitaryProgram,
  getTayProgram,
  PriorityTypes,
  getFlatRentAndRentBasedOnIncomeProgram,
} from "./shared"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitAccessibilityPriorityType } from "../../../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { UnitType } from "../../../unit-types/entities/unit-type.entity"
import { ReservedCommunityType } from "../../../reserved-community-type/entities/reserved-community-type.entity"
import { AmiChart } from "../../../ami-charts/entities/ami-chart.entity"
import { Property } from "../../../property/entities/property.entity"
import { Unit } from "../../../units/entities/unit.entity"
import { UnitsSummary } from "../../../units-summary/entities/units-summary.entity"
import { User } from "../../../auth/entities/user.entity"
import { ApplicationMethod } from "../../../application-methods/entities/application-method.entity"
import { Jurisdiction } from "../../../jurisdictions/entities/jurisdiction.entity"
import { Preference } from "../../../preferences/entities/preference.entity"
import { Program } from "../../../program/entities/program.entity"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultSeed {
  constructor(
    @InjectRepository(Listing) protected readonly listingRepository: Repository<Listing>,
    @InjectRepository(UnitAccessibilityPriorityType)
    protected readonly unitAccessibilityPriorityTypeRepository: Repository<
      UnitAccessibilityPriorityType
    >,
    @InjectRepository(UnitType) protected readonly unitTypeRepository: Repository<UnitType>,
    @InjectRepository(ReservedCommunityType)
    protected readonly reservedTypeRepository: Repository<ReservedCommunityType>,
    @InjectRepository(AmiChart) protected readonly amiChartRepository: Repository<AmiChart>,
    @InjectRepository(Property) protected readonly propertyRepository: Repository<Property>,
    @InjectRepository(Unit) protected readonly unitsRepository: Repository<Unit>,
    @InjectRepository(UnitsSummary)
    protected readonly unitsSummaryRepository: Repository<UnitsSummary>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @InjectRepository(ApplicationMethod)
    protected readonly applicationMethodRepository: Repository<ApplicationMethod>,
    @InjectRepository(Jurisdiction)
    protected readonly jurisdictionRepository: Repository<Jurisdiction>,
    @InjectRepository(Preference)
    protected readonly preferencesRepository: Repository<Preference>,
    @InjectRepository(Program)
    protected readonly programsRepository: Repository<Program>
  ) {}

  async seed() {
    const priorityTypeMobilityAndHearing = await this.unitAccessibilityPriorityTypeRepository.findOneOrFail(
      { name: PriorityTypes.mobilityHearing }
    )
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: "AlamedaCountyTCAC2021",
      jurisdiction: alamedaJurisdiction,
    })

    const property = await this.propertyRepository.save({
      ...getDefaultProperty(),
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = getDefaultUnits().map(
      (unit) => {
        return {
          ...unit,
          property: {
            id: property.id,
          },
          amiChart,
        }
      }
    )

    unitsToBeCreated[0].priorityType = priorityTypeMobilityAndHearing
    unitsToBeCreated[1].priorityType = priorityTypeMobilityAndHearing
    unitsToBeCreated[0].unitType = unitTypeOneBdrm
    unitsToBeCreated[1].unitType = unitTypeTwoBdrm
    const newUnits = await this.unitsRepository.save(unitsToBeCreated)

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...getDefaultListing(),
      amiChartOverrides: [
        {
          unit: { id: newUnits[0].id },
          items: [
            {
              percentOfAmi: 80,
              householdSize: 1,
              income: 777777,
            },
          ],
        },
      ],
      name: "Test: Default, Two Preferences",
      property: property,
      assets: getDefaultAssets(),
      listingPreferences: [
        {
          preference: await this.preferencesRepository.findOneOrFail({
            title: getLiveWorkPreference(alamedaJurisdiction.name).title,
          }),
          ordinal: 1,
          page: 1,
        },
        {
          preference: await this.preferencesRepository.findOneOrFail({
            title: getDisplaceePreference(alamedaJurisdiction.name).title,
          }),
          ordinal: 2,
          page: 1,
        },
      ],
      events: getDefaultListingEvents(),
      listingPrograms: [],
      jurisdictionName: "Alameda",
      jurisdiction: alamedaJurisdiction,
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}
