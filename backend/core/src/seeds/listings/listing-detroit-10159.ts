import { AssetDtoSeedType, ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const propertySeed: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "112 Seward Avenue",
    zipCode: "48202",
    latitude: 42.373219,
    longitude: -83.079147,
  },
  buildingTotalUnits: 49,
  neighborhood: "New Center Commons",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 60,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  isWaitlistOpen: true,
  waitlistCurrentSize: 20,
  waitlistMaxSize: 50,
  hrdId: "HRD10159",
  leasingAgentName: "Kim Hagood",
  leasingAgentPhone: "313-656-4146",
  managementCompany: "Elite Property Management LLC",
  managementWebsite: "www.elitep-m.com",
  name: "New Center Square",
  status: ListingStatus.active,
  image: undefined,
  digitalApplication: undefined,
  paperApplication: undefined,
  referralOpportunity: undefined,
  depositMin: undefined,
  depositMax: undefined,
  leasingAgentEmail: undefined,
  rentalAssistance: undefined,
  reviewOrderType: undefined,
  features: {
    elevator: false,
    wheelchairRamp: true,
    serviceAnimalsAllowed: true,
    accessibleParking: true,
    parkingOnSite: true,
    inUnitWasherDryer: true,
    laundryInBuilding: false,
    barrierFreeEntrance: true,
    rollInShower: false,
    grabBars: false,
    heatingInUnit: true,
    acInUnit: true,
  },
}

export class Listing10159Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://static.wixstatic.com/media/eb2e58_2e54166bcc1c4a07a50d03fb3522a385~mv2.jpg/v1/fill/w_297,h_199,al_c,lg_1,q_80/eb2e58_2e54166bcc1c4a07a50d03fb3522a385~mv2.webp",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: JSON.parse(JSON.stringify(assets)),
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 49,
      listing: listing,
    }
    await this.unitsSummaryRepository.save([threeBdrmUnitsSummary])

    return listing
  }
}
