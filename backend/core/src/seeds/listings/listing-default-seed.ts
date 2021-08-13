import { InjectRepository } from "@nestjs/typeorm"
import { BaseEntity, DeepPartial, Repository } from "typeorm"

import { Listing } from "../../listings/entities/listing.entity"
import { UnitAccessibilityPriorityType } from "../../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { UnitType } from "../../unit-types/entities/unit-type.entity"
import { ReservedCommunityType } from "../../reserved-community-type/entities/reserved-community-type.entity"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { Property } from "../../property/entities/property.entity"
import { Unit } from "../../units/entities/unit.entity"
import { User } from "../../auth/entities/user.entity"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import {
  getDefaultAmiChart,
  getDefaultAssets,
  getDefaultListing,
  getDefaultListingEvents,
  getDefaultProperty,
  getDefaultUnits,
  getDisplaceePreference,
  getLiveWorkPreference,
} from "./shared"
import { ApplicationMethod } from "../../application-methods/entities/application-method.entity"

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
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @InjectRepository(ApplicationMethod)
    protected readonly applicationMethodRepository: Repository<ApplicationMethod>
  ) {}

  async seed() {
    const priorityTypeMobilityAndHearing = await this.unitAccessibilityPriorityTypeRepository.findOneOrFail(
      { name: "Mobility and hearing" }
    )
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })
    const amiChart = await this.amiChartRepository.save(getDefaultAmiChart())

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
    await this.unitsRepository.save(unitsToBeCreated)

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...getDefaultListing(),
      name: "Test: Default, Two Preferences",
      property: property,
      assets: getDefaultAssets(),
      preferences: [getLiveWorkPreference(), { ...getDisplaceePreference(), ordinal: 2 }],
      events: getDefaultListingEvents(),
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}
