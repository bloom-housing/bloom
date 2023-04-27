import { ExternalListing } from "../../../listings/combined/external-listing.entity"
import { AssetDtoSeedType, UnitSeedType } from "./listings"
import { getDate } from "./shared"
import { BaseEntity, Connection } from "typeorm"

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED

type ExternalListingSeedType = Omit<
  ExternalListing,
  | keyof BaseEntity
  | "assets"
  | "listingMultiselectQuestions"
  | "units"
  | "unitsSummarized"
  | "jurisdiction"
  | "reservedCommunityType"
> & {
  jurisdiction: { id: string; name: string }
  assets: Array<AssetDtoSeedType>
  units: Array<UnitSeedType>
  listingMultiselectQuestions: Array<{
    ordinal: number
    multiselectQuestion: {
      id: string
    }
  }>
  reservedCommunityType: { id: string; name: string }
}

export const getExternalListingSeedData = () => {
  const listings: ExternalListingSeedType[] = [
    {
      id: "2dfca9a5-6b01-4683-be1c-e3fa0880800f",
      assets: [
        {
          fileId: "https://url.to/some/external/image.jpg",
          label: "building",
        },
      ],
      householdSizeMin: 1,
      householdSizeMax: 3,
      unitsAvailable: 2,
      applicationOpenDate: getDate(-6),
      applicationDueDate: new Date(getDate(3).setHours(17, 0, 0, 0)),
      name: "Test: External Listing - Full",
      waitlistCurrentSize: 0,
      waitlistMaxSize: 5,
      isWaitlistOpen: false,
      status: "active",
      reviewOrderType: "lottery",
      publishedAt: getDate(-7),
      updatedAt: getDate(-3),
      lastApplicationUpdateAt: getDate(-1),
      reservedCommunityTypeName: "senior62",
      urlSlug: "test_external_listing_full",
      neighborhood: "Park Place",
      images: [],
      listingMultiselectQuestions: [
        {
          ordinal: 1,
          multiselectQuestion: {
            id: "cc213d2b-6d4b-48a3-8177-b51932002099",
          },
        },
        {
          ordinal: 2,
          multiselectQuestion: {
            id: "64d292c4-8b14-4a35-8d1a-89839f4a6806",
          },
        },
      ],
      jurisdiction: {
        id: "d98fd25b-df6c-4f6a-b93f-bbd347b9da69",
        name: "External Jurisdiction",
      },
      reservedCommunityType: {
        id: "8cf689ba-c820-4d61-a8ee-d76387a0e85a",
        name: "senior62",
      },
      units: [
        {
          monthlyIncomeMin: "1000.00",
          floor: 1,
          maxOccupancy: 3,
          minOccupancy: 1,
          monthlyRent: "1234.00",
          sqFeet: "1100",
          numBedrooms: 2,
          monthlyRentAsPercentOfIncome: null,
        },
        {
          monthlyIncomeMin: "2000.00",
          floor: 2,
          maxOccupancy: 5,
          minOccupancy: 2,
          monthlyRent: "5678.00",
          sqFeet: "1500",
          numBedrooms: 3,
          monthlyRentAsPercentOfIncome: null,
        },
      ],
      buildingAddress: {
        county: "San Alameda",
        city: "Anytown",
        street: "123 Sesame Street",
        zipCode: "90210",
        state: "CA",
        latitude: 37.7549632,
        longitude: -122.1968792,
      },
      features: {
        elevator: true,
        wheelchairRamp: false,
        serviceAnimalsAllowed: null,
        accessibleParking: true,
        parkingOnSite: false,
        inUnitWasherDryer: null,
        laundryInBuilding: true,
        barrierFreeEntrance: false,
        rollInShower: null,
        grabBars: true,
        heatingInUnit: false,
        acInUnit: null,
      },
      utilities: {
        water: true,
        gas: false,
        trash: null,
        sewer: true,
        electricity: false,
        cable: null,
        phone: true,
        internet: false,
      },
    },
    {
      id: "9beacfb5-9611-4e02-816f-89810b83d1ba",
      assets: [
        {
          fileId: "https://url.to/some/other/image.jpg",
          label: "building",
        },
      ],
      householdSizeMin: 1,
      householdSizeMax: 3,
      unitsAvailable: 0,
      applicationOpenDate: getDate(-6),
      applicationDueDate: new Date(getDate(3).setHours(17, 0, 0, 0)),
      name: "Test: External Listing - Empty",
      waitlistCurrentSize: 0,
      waitlistMaxSize: 5,
      isWaitlistOpen: false,
      status: "active",
      reviewOrderType: "lottery",
      publishedAt: getDate(-7),
      updatedAt: getDate(-3),
      lastApplicationUpdateAt: getDate(-1),
      reservedCommunityTypeName: null,
      urlSlug: "test_external_listing_empty",
      neighborhood: null,
      images: [],
      listingMultiselectQuestions: [],
      jurisdiction: {
        id: "d98fd25b-df6c-4f6a-b93f-bbd347b9da69",
        name: "External Jurisdiction",
      },
      reservedCommunityType: null,
      units: [],
      buildingAddress: {
        county: "San Alameda",
        city: "Anytown",
        street: "123 Sesame Street",
        zipCode: "90210",
        state: "CA",
        latitude: 37.7549632,
        longitude: -122.1968792,
      },
      features: null,
      utilities: null,
    },
  ]

  return listings
}

export class ExternalListingSeed {
  conn: Connection

  constructor(conn: Connection) {
    this.conn = conn
  }

  public async seed() {
    const qb = this.conn.createQueryBuilder()
    const listings = getExternalListingSeedData()
    await qb.insert().into(ExternalListing).values(listings).execute()
  }
}
