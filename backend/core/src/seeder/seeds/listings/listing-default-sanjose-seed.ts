import { InjectRepository } from "@nestjs/typeorm"
import { BaseEntity, DeepPartial, Repository } from "typeorm"

import {
  getDefaultAssets,
  getDefaultListing,
  getDefaultListingEvents,
  getDefaultUnits,
  getDisplaceePreference,
  getLiveWorkPreference,
  PriorityTypes,
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
import { CountyCode } from "../../../shared/types/county-code"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"

export class ListingDefaultSanJoseSeed {
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
    protected readonly jurisdictionRepository: Repository<Jurisdiction>
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

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...getDefaultListing(),

      name: "Test: Default, Two Preferences (San Jose)",
      assets: getDefaultAssets(),
      listingMultiselectQuestions: [
        {
          multiselectQuestion: getLiveWorkPreference(alamedaJurisdiction.name),
        },
        {
          multiselectQuestion: { ...getDisplaceePreference(alamedaJurisdiction.name), ordinal: 2 },
        },
      ],

      events: getDefaultListingEvents(),
      jurisdictionName: "San Jose",
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
