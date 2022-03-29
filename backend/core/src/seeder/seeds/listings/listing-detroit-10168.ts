import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { CountyCode } from "../../../shared/types/county-code"
import { ApplicationMethod } from "../../../application-methods/entities/application-method.entity"
import { ApplicationMethodType } from "../../../application-methods/types/application-method-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../../listings/entities/listing.entity"
import { UnitGroup } from "../../../units-summary/entities/unit-group.entity"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "4401 Burlingame St",
    zipCode: "48204",
    latitude: 42.37704,
    longitude: -83.12847,
  },
  buildingTotalUnits: 10,
  neighborhood: "Nardin Park",
  unitAmenities:
    "Professional Management Team, Smoke-free building, Gated community, Entry control system, Community room, Nicely appointed lobby area, On-site laundry with fully accessible washers and dryers, Lovely patio area to relax, 24-hour emergency maintenance, Cable-ready",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 30,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10168",
  leasingAgentName: "Chris Garland",
  leasingAgentPhone: "313-934-0010",
  leasingAgentEmail: "OakVillageIndependenceHouse@voami.org",
  managementCompany: "Detroit Voa Elderly Nonprofit Housing Corporation",
  managementWebsite: "www.voa.org/housing_properties/oak-village-independence-house",
  name: "Oak Village Independence",
  status: ListingStatus.active,
  image: undefined,
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  isWaitlistOpen: undefined,
  features: {
    elevator: true,
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: true,
    laundryInBuilding: true,
    barrierFreeEntrance: true,
    rollInShower: true,
    grabBars: true,
    heatingInUnit: true,
    acInUnit: true,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
}

export class Listing10168Seed extends ListingDefaultSeed {
  async seed() {
    const applicationMethod: ApplicationMethod = await this.applicationMethodRepository.save({
      type: ApplicationMethodType.ExternalLink,
      acceptsPostmarkedApplications: false,
      externalReference:
        "https://voa-production.s3.amazonaws.com/uploads/pdf_file/file/1118/Oak_Village_Independence_House_Resident_Selection_Guidelines.pdf",
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://voa-production.s3.amazonaws.com/uploads/housing_property_image/image/1290/DSC_0881.jpg",
      },
    ]

    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })
    const reservedType = await this.reservedTypeRepository.findOneOrFail({ name: "specialNeeds" })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [applicationMethod],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      reservedCommunityType: reservedType,
      // If a reservedCommunityType is specified, a reservedCommunityDescription MUST also be specified
      reservedCommunityDescription: "Persons with Disabilities",
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const oneBdrmUnitGroup: DeepPartial<UnitGroup> = {
      unitType: [unitTypeOneBdrm],
      totalCount: 10,
      listing: listing,
    }
    await this.unitGroupRepository.save([oneBdrmUnitGroup])

    return listing
  }
}
