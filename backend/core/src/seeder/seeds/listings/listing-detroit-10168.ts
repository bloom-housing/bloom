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
  managementWebsite: "https://www.voa.org/housing_properties/oak-village-independence-house",
  name: "Oak Village Independence",
  status: ListingStatus.active,
  images: [],
  digitalApplication: undefined,
  paperApplication: undefined,
  section8Acceptance: null,
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
  utilities: {
    water: null,
    gas: null,
    trash: null,
    sewer: true,
    electricity: null,
    cable: null,
    phone: null,
    internet: null,
  },
  listingPreferences: [],
  jurisdictionName: "Detroit",
  marketingType: ListingMarketingTypeEnum.Marketing,
  whatToExpect: `<div><div className="mb-3">If you are interested in applying for this property, please get in touch in one of these ways:</div><div><ul class="list-disc pl-6"><li>Phone</li><li>Email</li><li>In-person</li><li>In some instances, the property has a link directly to an application</li></ul></div><div className="mt-2">Once you contact a property, ask if they have any available units if you are looking to move in immediately.</div><div className="mt-2"><strong>Waitlists</strong>:<div>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</div>`,
  whatToExpectAdditionalText: `<ul className="list-disc pl-6"><li>Property staff should walk you through the process to get on their waitlist.</li><li>You can be on waitlists for multiple properties, but you will need to contact each one of them to begin that process.</li><li>Even if you are on a waitlist, it can take months or over a year to get an available unit for that building.</li><li>Many properties that are affordable because of government funding or agreements have long waitlists. If you're on a waitlist for a property, you should contact the property on a regular basis to see if any units are available.</li></ul>`,
}

export class Listing10168Seed extends ListingDefaultSeed {
  async seed() {
    const applicationMethod: ApplicationMethod = await this.applicationMethodRepository.save({
      type: ApplicationMethodType.ExternalLink,
      acceptsPostmarkedApplications: false,
      externalReference:
        "https://voa-production.s3.amazonaws.com/uploads/pdf_file/file/1118/Oak_Village_Independence_House_Resident_Selection_Guidelines.pdf",
    })

    const assets: Array<AssetDtoSeedType> = []

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
      digitalApplication: true,
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
