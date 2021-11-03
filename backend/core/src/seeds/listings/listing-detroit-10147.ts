import { ListingSeedType, PropertySeedType } from "./listings"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CountyCode } from "../../shared/types/county-code"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"

const mshProperty: PropertySeedType = {
  buildingAddress: {
    city: "Detroit",
    state: "MI",
    street: "7335 Melrose St",
    zipCode: "48211",
    latitude: 42.37442,
    longitude: -83.06363,
  },
  buildingTotalUnits: 24,
  neighborhood: "North End",
}

const mshListing: ListingSeedType = {
  applicationDropOffAddress: null,
  applicationMailingAddress: null,
  countyCode: CountyCode.detroit,
  CSVFormattingType: CSVFormattingType.basic,
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  hrdId: "HRD10147",
  leasingAgentName: "Kim Hagood",
  leasingAgentPhone: "248-228-1340",
  managementCompany: "Elite Property Management LLC",
  managementWebsite: "www.elitep-m.com",
  name: "Melrose Square Homes",
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

export class Listing10147Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...mshProperty,
    })

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...mshListing,
      applicationMethods: [],
      assets: [],
      events: [],
      property: property,
      preferences: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const mshUnitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const fourBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeFourBdrm,
      totalCount: 15,
      listing: listing,
    }
    mshUnitsSummaryToBeCreated.push(fourBdrmUnitsSummary)

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 9,
      listing: listing,
    }
    mshUnitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(mshUnitsSummaryToBeCreated)

    return listing
  }
}
