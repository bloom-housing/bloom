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
    street: "12026 Morang",
    zipCode: "48224",
    latitude: 42.42673,
    longitude: -82.95126,
  },
  buildingTotalUnits: 40,
  neighborhood: "Moross-Morang",
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
  hrdId: "HRD10153",
  leasingAgentPhone: "313-999-1268",
  managementCompany: "Smiley Management",
  name: "Morang Apartments",
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
}

export class Listing10153Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId: "/images/dev/Morang Apartments.png",
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: assets,
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 40,
      listing: listing,
    }

    await this.unitsSummaryRepository.save([oneBdrmUnitsSummary])

    return listing
  }
}
