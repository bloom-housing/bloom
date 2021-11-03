import { ListingSeedType, PropertySeedType } from "./listings"
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
    street: "20000 Dequindre St",
    zipCode: "48234",
    latitude: 42.44133,
    longitude: -83.08308,
  },
  buildingTotalUnits: 151,
  neighborhood: "Nolan",
}

const listingSeed: ListingSeedType = {
  amiPercentageMax: 50,
  amiPercentageMin: 30,
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10155",
  leasingAgentName: "Ryan Beale",
  leasingAgentPhone: "313-366-1616",
  managementCompany: "Premier Property Management",
  name: "Morton Manor",
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
  isWaitlistOpen: undefined,
}

export class Listing10155Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...listingSeed,
      applicationMethods: [],
      assets: [],
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const oneBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeOneBdrm,
      totalCount: 150,
      listing: listing,
    }
    await this.unitsSummaryRepository.save([oneBdrmUnitsSummary])

    return listing
  }
}
