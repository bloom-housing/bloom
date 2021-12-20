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
    street: "2515 W Forest Ave",
    zipCode: "48208",
    latitude: 42.34547,
    longitude: -83.08877,
  },
  buildingTotalUnits: 45,
  neighborhood: "Core City",
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
  hrdId: "HRD10151",
  leasingAgentName: "Natasha Gaston",
  leasingAgentPhone: "313-926-8509",
  managementCompany: "NRP Group",
  managementWebsite: "www.nrpgroup.com/Home/Communities",
  name: "MLK Homes",
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

export class Listing10151Seed extends ListingDefaultSeed {
  async seed() {
    const unitTypeThreeBdrm = await this.unitTypeRepository.findOneOrFail({ name: "threeBdrm" })
    const unitTypeFourBdrm = await this.unitTypeRepository.findOneOrFail({ name: "fourBdrm" })

    const property = await this.propertyRepository.save({
      ...propertySeed,
    })

    const reservedType = await this.reservedTypeRepository.findOneOrFail({ name: "specialNeeds" })

    const assets: Array<AssetDtoSeedType> = [
      {
        label: "building",
        fileId:
          "https://images1.apartments.com/i2/Lzldwt350ozz-zuJtBQf3-V7EB0-hqEaz5ssWS4sCAI/112/martin-luther-king-apartments-detroit-mi-primary-photo.jpg?p=1",
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
      reservedCommunityType: reservedType,
      // If a reservedCommunityType is specified, a reservedCommunityDescription MUST also be specified
      reservedCommunityDescription: "",
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const unitsSummaryToBeCreated: UnitsSummaryCreateDto[] = []

    const threeBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeThreeBdrm,
      totalCount: 16,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(threeBdrmUnitsSummary)

    const fourBdrmUnitsSummary: UnitsSummaryCreateDto = {
      unitType: unitTypeFourBdrm,
      totalCount: 29,
      listing: listing,
    }
    unitsSummaryToBeCreated.push(fourBdrmUnitsSummary)

    await this.unitsSummaryRepository.save(unitsSummaryToBeCreated)

    return listing
  }
}
