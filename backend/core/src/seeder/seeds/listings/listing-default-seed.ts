import { InjectRepository } from "@nestjs/typeorm"
import { BaseEntity, DeepPartial, Repository } from "typeorm"

import {
  getDefaultAssets,
  getDefaultListing,
  getDefaultListingEvents,
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
import { Unit } from "../../../units/entities/unit.entity"
import { User } from "../../../auth/entities/user.entity"
import { ApplicationMethod } from "../../../application-methods/entities/application-method.entity"
import { Jurisdiction } from "../../../jurisdictions/entities/jurisdiction.entity"
import { MultiselectQuestion } from "../../../multiselect-question/entities/multiselect-question.entity"
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"
import { Asset } from "../../../assets/entities/asset.entity"
import dayjs from "dayjs"

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
    @InjectRepository(Unit) protected readonly unitsRepository: Repository<Unit>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @InjectRepository(ApplicationMethod)
    protected readonly applicationMethodRepository: Repository<ApplicationMethod>,
    @InjectRepository(Jurisdiction)
    protected readonly jurisdictionRepository: Repository<Jurisdiction>,
    @InjectRepository(MultiselectQuestion)
    protected readonly multiselectQuestionsRepository: Repository<MultiselectQuestion>,
    @InjectRepository(Asset) protected readonly assetsRepository: Repository<Asset>
  ) {}

  async seed() {
    const priorityTypeMobilityAndHearing = await this.unitAccessibilityPriorityTypeRepository.findOneOrFail(
      { where: { name: PriorityTypes.mobilityHearing } }
    )
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "oneBdrm" },
    })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "twoBdrm" },
    })
    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.alameda },
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      where: {
        name: "AlamedaCountyTCAC2021",
        jurisdiction: {
          name: alamedaJurisdiction.name,
        },
      },
    })

    const defaultImage = await this.assetsRepository.save(getDefaultAssets()[0])

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...getDefaultListing(),

      name: "Test: Default, Two Preferences",
      publishedAt: dayjs(new Date()).subtract(1, "hour"),
      assets: getDefaultAssets(),
      listingMultiselectQuestions: [
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getLiveWorkPreference(alamedaJurisdiction.name).text },
          }),
          ordinal: 1,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getDisplaceePreference(alamedaJurisdiction.name).text },
          }),
          ordinal: 2,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getServedInMilitaryProgram(alamedaJurisdiction.name).text },
          }),
          ordinal: 1,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getTayProgram(alamedaJurisdiction.name).text },
          }),
          ordinal: 2,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getDisabilityOrMentalIllnessProgram(alamedaJurisdiction.name).text },
          }),
          ordinal: 3,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getHousingSituationProgram(alamedaJurisdiction.name).text },
          }),
          ordinal: 4,
        },
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getFlatRentAndRentBasedOnIncomeProgram(alamedaJurisdiction.name).text },
          }),
          ordinal: 5,
        },
      ],
      events: getDefaultListingEvents(),
      images: [
        {
          image: defaultImage,
          ordinal: 1,
        },
      ],
      jurisdictionName: "Alameda",
      jurisdiction: alamedaJurisdiction,
    }

    let listing = await this.listingRepository.save(listingCreateDto)

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = getDefaultUnits().map(
      (unit) => {
        return {
          ...unit,
          listing: {
            id: listing.id,
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

    listing = await this.listingRepository.save({
      ...listing,
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
    })

    return listing
  }
}
