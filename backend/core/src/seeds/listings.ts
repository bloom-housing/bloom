import { Listing } from "../listings/entities/listing.entity"
import { ListingCreateDto } from "../listings/dto/listing.dto"
import { UnitCreateDto } from "../units/dto/unit.dto"
import { PropertyCreateDto } from "../property/dto/property.dto"
import { PreferenceCreateDto } from "../preferences/dto/preference.dto"
import { BaseEntity, Repository } from "typeorm"
import { Property } from "../property/entities/property.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ApplicationMethodType, AssetDto, Unit } from "../.."
import { INestApplicationContext } from "@nestjs/common"
import { AmiChartCreateDto } from "../ami-charts/dto/ami-chart.dto"
import { User } from "../user/entities/user.entity"
import { UserCreateDto } from "../user/dto/user.dto"
import { ListingStatus } from "../listings/types/listing-status-enum"
import { ListingEventDto } from "../listings/dto/listing-event.dto"
import { ApplicationMethodDto } from "../listings/dto/application-method.dto"
import { CSVFormattingType } from "../csv/types/csv-formatting-type-enum"
import { CountyCode } from "../shared/types/county-code"
import { ListingEventType } from "../listings/types/listing-event-type-enum"
import { InputType } from "../shared/types/input-type"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { IdDto } from "../shared/dto/id.dto"

// Properties that are ommited in DTOS derived types are relations and getters
export interface ListingSeed {
  amiChart: AmiChartCreateDto
  units: Array<Omit<UnitCreateDto, "property">>
  applicationMethods: Array<Omit<ApplicationMethodDto, "listing">>
  property: Omit<
    PropertyCreateDto,
    | "propertyGroups"
    | "listings"
    | "units"
    | "unitsSummarized"
    | "householdSizeMin"
    | "householdSizeMax"
  >
  preferences: Array<Omit<PreferenceCreateDto, "listing">>
  listingEvents: Array<Omit<ListingEventDto, "listing">>
  assets: Array<Omit<AssetDto, "listing">>
  listing: Omit<
    ListingCreateDto,
    | keyof BaseEntity
    | "property"
    | "urlSlug"
    | "applicationMethods"
    | "events"
    | "assets"
    | "preferences"
    | "leasingAgents"
    | "showWaitlist"
  >
  leasingAgents: UserCreateDto[]
}

export async function seedListing(
  app: INestApplicationContext,
  seed: ListingSeed,
  leasingAgents: IdDto[]
) {
  const amiChartRepo = app.get<Repository<AmiChart>>(getRepositoryToken(AmiChart))
  const propertyRepo = app.get<Repository<Property>>(getRepositoryToken(Property))
  const unitsRepo = app.get<Repository<Unit>>(getRepositoryToken(Unit))
  const listingsRepo = app.get<Repository<Listing>>(getRepositoryToken(Listing))

  app.get<Repository<User>>(getRepositoryToken(User))

  const amiChart = await amiChartRepo.save(seed.amiChart)

  const property = await propertyRepo.save({
    ...seed.property,
  })

  const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = seed.units.map((unit) => {
    return {
      ...unit,
      property: {
        id: property.id,
      },
      amiChart,
    }
  })
  await unitsRepo.save(unitsToBeCreated)

  const listingCreateDto: Omit<ListingCreateDto, keyof BaseEntity | "urlSlug" | "showWaitlist"> = {
    ...seed.listing,
    property,
    leasingAgents: leasingAgents,
    assets: seed.assets,
    preferences: seed.preferences,
    applicationMethods: seed.applicationMethods,
    events: seed.listingEvents,
  }

  return await listingsRepo.save(listingCreateDto)
}

const getDate = (days: number) => {
  const someDate = new Date()
  someDate.setDate(someDate.getDate() + days)
  return someDate
}

// AMI Charts
const defaultAmiChart: AmiChartCreateDto = {
  name: "AlamedaCountyTCAC2021",
  items: [
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 76720,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 87680,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 98640,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 109600,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 11840,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 127200,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 135920,
    },
    {
      percentOfAmi: 80,
      householdSize: 8,
      income: 144720,
    },
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 57540,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 65760,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 73980,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 82200,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 88800,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 95400,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 101940,
    },
    {
      percentOfAmi: 60,
      householdSize: 8,
      income: 108540,
    },
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 47950,
    },
    {
      percentOfAmi: 50,
      householdSize: 2,
      income: 54800,
    },
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 61650,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 68500,
    },
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 74000,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 79500,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 84950,
    },
    {
      percentOfAmi: 50,
      householdSize: 8,
      income: 90450,
    },
    {
      percentOfAmi: 45,
      householdSize: 1,
      income: 43155,
    },
    {
      percentOfAmi: 45,
      householdSize: 2,
      income: 49320,
    },
    {
      percentOfAmi: 45,
      householdSize: 3,
      income: 55485,
    },
    {
      percentOfAmi: 45,
      householdSize: 4,
      income: 61650,
    },
    {
      percentOfAmi: 45,
      householdSize: 5,
      income: 66600,
    },
    {
      percentOfAmi: 45,
      householdSize: 6,
      income: 71550,
    },
    {
      percentOfAmi: 45,
      householdSize: 7,
      income: 76455,
    },
    {
      percentOfAmi: 45,
      householdSize: 8,
      income: 81405,
    },
    {
      percentOfAmi: 40,
      householdSize: 1,
      income: 38360,
    },
    {
      percentOfAmi: 40,
      householdSize: 2,
      income: 43840,
    },
    {
      percentOfAmi: 40,
      householdSize: 3,
      income: 49320,
    },
    {
      percentOfAmi: 40,
      householdSize: 4,
      income: 54800,
    },
    {
      percentOfAmi: 40,
      householdSize: 5,
      income: 59200,
    },
    {
      percentOfAmi: 40,
      householdSize: 6,
      income: 63600,
    },
    {
      percentOfAmi: 40,
      householdSize: 7,
      income: 67960,
    },
    {
      percentOfAmi: 40,
      householdSize: 8,
      income: 72360,
    },
    {
      percentOfAmi: 30,
      householdSize: 1,
      income: 28770,
    },
    {
      percentOfAmi: 30,
      householdSize: 2,
      income: 32880,
    },
    {
      percentOfAmi: 30,
      householdSize: 3,
      income: 36990,
    },
    {
      percentOfAmi: 30,
      householdSize: 4,
      income: 41100,
    },
    {
      percentOfAmi: 30,
      householdSize: 5,
      income: 44400,
    },
    {
      percentOfAmi: 30,
      householdSize: 6,
      income: 47700,
    },
    {
      percentOfAmi: 30,
      householdSize: 7,
      income: 50970,
    },
    {
      percentOfAmi: 30,
      householdSize: 8,
      income: 54270,
    },
    {
      percentOfAmi: 20,
      householdSize: 1,
      income: 19180,
    },
    {
      percentOfAmi: 20,
      householdSize: 2,
      income: 21920,
    },
    {
      percentOfAmi: 20,
      householdSize: 3,
      income: 24660,
    },
    {
      percentOfAmi: 20,
      householdSize: 4,
      income: 27400,
    },
    {
      percentOfAmi: 20,
      householdSize: 5,
      income: 29600,
    },
    {
      percentOfAmi: 20,
      householdSize: 6,
      income: 31800,
    },
    {
      percentOfAmi: 20,
      householdSize: 7,
      income: 33980,
    },
    {
      percentOfAmi: 20,
      householdSize: 8,
      income: 36180,
    },
  ],
}

const tritonAmiChart: AmiChartCreateDto = {
  name: "San Jose TCAC 2019",
  items: [
    {
      percentOfAmi: 120,
      householdSize: 1,
      income: 110400,
    },
    {
      percentOfAmi: 120,
      householdSize: 2,
      income: 126150,
    },
    {
      percentOfAmi: 120,
      householdSize: 3,
      income: 141950,
    },
    {
      percentOfAmi: 120,
      householdSize: 4,
      income: 157700,
    },
    {
      percentOfAmi: 120,
      householdSize: 5,
      income: 170300,
    },
    {
      percentOfAmi: 120,
      householdSize: 6,
      income: 182950,
    },
    {
      percentOfAmi: 120,
      householdSize: 7,
      income: 195550,
    },
    {
      percentOfAmi: 120,
      householdSize: 8,
      income: 208150,
    },
    {
      percentOfAmi: 110,
      householdSize: 1,
      income: 101200,
    },
    {
      percentOfAmi: 110,
      householdSize: 2,
      income: 115610,
    },
    {
      percentOfAmi: 110,
      householdSize: 3,
      income: 130075,
    },
    {
      percentOfAmi: 110,
      householdSize: 4,
      income: 144540,
    },
    {
      percentOfAmi: 110,
      householdSize: 5,
      income: 156090,
    },
    {
      percentOfAmi: 110,
      householdSize: 6,
      income: 167640,
    },
    {
      percentOfAmi: 110,
      householdSize: 7,
      income: 179245,
    },
    {
      percentOfAmi: 110,
      householdSize: 8,
      income: 190795,
    },
    {
      percentOfAmi: 100,
      householdSize: 1,
      income: 92000,
    },
    {
      percentOfAmi: 100,
      householdSize: 2,
      income: 105100,
    },
    {
      percentOfAmi: 100,
      householdSize: 3,
      income: 118250,
    },
    {
      percentOfAmi: 100,
      householdSize: 4,
      income: 131400,
    },
    {
      percentOfAmi: 100,
      householdSize: 5,
      income: 141900,
    },
    {
      percentOfAmi: 100,
      householdSize: 6,
      income: 152400,
    },
    {
      percentOfAmi: 100,
      householdSize: 7,
      income: 162950,
    },
    {
      percentOfAmi: 100,
      householdSize: 8,
      income: 173450,
    },
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 72750,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 83150,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 93550,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 103900,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 112250,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 120550,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 128850,
    },
    {
      percentOfAmi: 80,
      householdSize: 8,
      income: 137150,
    },
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 61500,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 70260,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 79020,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 87780,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 94860,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 101880,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 108900,
    },
    {
      percentOfAmi: 60,
      householdSize: 8,
      income: 115920,
    },
    {
      percentOfAmi: 55,
      householdSize: 1,
      income: 56375,
    },
    {
      percentOfAmi: 55,
      householdSize: 2,
      income: 64405,
    },
    {
      percentOfAmi: 55,
      householdSize: 3,
      income: 72435,
    },
    {
      percentOfAmi: 55,
      householdSize: 4,
      income: 80465,
    },
    {
      percentOfAmi: 55,
      householdSize: 5,
      income: 86955,
    },
    {
      percentOfAmi: 55,
      householdSize: 6,
      income: 93390,
    },
    {
      percentOfAmi: 55,
      householdSize: 7,
      income: 99825,
    },
    {
      percentOfAmi: 55,
      householdSize: 8,
      income: 106260,
    },
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 51250,
    },
    {
      percentOfAmi: 50,
      householdSize: 2,
      income: 58550,
    },
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 65850,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 73150,
    },
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 79050,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 84900,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 90750,
    },
    {
      percentOfAmi: 50,
      householdSize: 8,
      income: 96600,
    },
    {
      percentOfAmi: 45,
      householdSize: 1,
      income: 46125,
    },
    {
      percentOfAmi: 45,
      householdSize: 2,
      income: 52695,
    },
    {
      percentOfAmi: 45,
      householdSize: 3,
      income: 59265,
    },
    {
      percentOfAmi: 45,
      householdSize: 4,
      income: 65835,
    },
    {
      percentOfAmi: 45,
      householdSize: 5,
      income: 71145,
    },
    {
      percentOfAmi: 45,
      householdSize: 6,
      income: 76410,
    },
    {
      percentOfAmi: 45,
      householdSize: 7,
      income: 81675,
    },
    {
      percentOfAmi: 40,
      householdSize: 1,
      income: 41000,
    },
    {
      percentOfAmi: 40,
      householdSize: 2,
      income: 46840,
    },
    {
      percentOfAmi: 40,
      householdSize: 3,
      income: 52680,
    },
    {
      percentOfAmi: 40,
      householdSize: 4,
      income: 58520,
    },
    {
      percentOfAmi: 40,
      householdSize: 5,
      income: 63240,
    },
    {
      percentOfAmi: 40,
      householdSize: 6,
      income: 67920,
    },
    {
      percentOfAmi: 40,
      householdSize: 7,
      income: 72600,
    },
    {
      percentOfAmi: 40,
      householdSize: 8,
      income: 77280,
    },
    {
      percentOfAmi: 35,
      householdSize: 1,
      income: 35875,
    },
    {
      percentOfAmi: 35,
      householdSize: 2,
      income: 40985,
    },
    {
      percentOfAmi: 35,
      householdSize: 3,
      income: 46095,
    },
    {
      percentOfAmi: 35,
      householdSize: 4,
      income: 51205,
    },
    {
      percentOfAmi: 35,
      householdSize: 5,
      income: 55335,
    },
    {
      percentOfAmi: 35,
      householdSize: 6,
      income: 59430,
    },
    {
      percentOfAmi: 35,
      householdSize: 7,
      income: 63525,
    },
    {
      percentOfAmi: 35,
      householdSize: 8,
      income: 67620,
    },
    {
      percentOfAmi: 30,
      householdSize: 1,
      income: 30750,
    },
    {
      percentOfAmi: 30,
      householdSize: 2,
      income: 35130,
    },
    {
      percentOfAmi: 30,
      householdSize: 3,
      income: 39510,
    },
    {
      percentOfAmi: 30,
      householdSize: 4,
      income: 43890,
    },
    {
      percentOfAmi: 30,
      householdSize: 5,
      income: 47430,
    },
    {
      percentOfAmi: 30,
      householdSize: 6,
      income: 50940,
    },
    {
      percentOfAmi: 30,
      householdSize: 7,
      income: 54450,
    },
    {
      percentOfAmi: 25,
      householdSize: 1,
      income: 25625,
    },
    {
      percentOfAmi: 25,
      householdSize: 2,
      income: 29275,
    },
    {
      percentOfAmi: 25,
      householdSize: 3,
      income: 32925,
    },
    {
      percentOfAmi: 25,
      householdSize: 4,
      income: 36575,
    },
    {
      percentOfAmi: 25,
      householdSize: 5,
      income: 39525,
    },
    {
      percentOfAmi: 25,
      householdSize: 6,
      income: 42450,
    },
    {
      percentOfAmi: 25,
      householdSize: 7,
      income: 45375,
    },
    {
      percentOfAmi: 25,
      householdSize: 8,
      income: 48300,
    },
    {
      percentOfAmi: 20,
      householdSize: 1,
      income: 20500,
    },
    {
      percentOfAmi: 20,
      householdSize: 2,
      income: 23420,
    },
    {
      percentOfAmi: 20,
      householdSize: 3,
      income: 26340,
    },
    {
      percentOfAmi: 20,
      householdSize: 4,
      income: 29260,
    },
    {
      percentOfAmi: 20,
      householdSize: 5,
      income: 31620,
    },
    {
      percentOfAmi: 20,
      householdSize: 6,
      income: 33960,
    },
    {
      percentOfAmi: 20,
      householdSize: 7,
      income: 36300,
    },
    {
      percentOfAmi: 20,
      householdSize: 8,
      income: 38640,
    },
    {
      percentOfAmi: 15,
      householdSize: 1,
      income: 15375,
    },
    {
      percentOfAmi: 15,
      householdSize: 2,
      income: 17565,
    },
    {
      percentOfAmi: 15,
      householdSize: 3,
      income: 19755,
    },
    {
      percentOfAmi: 15,
      householdSize: 4,
      income: 21945,
    },
    {
      percentOfAmi: 15,
      householdSize: 5,
      income: 23715,
    },
    {
      percentOfAmi: 15,
      householdSize: 6,
      income: 25470,
    },
    {
      percentOfAmi: 15,
      householdSize: 7,
      income: 27225,
    },
    {
      percentOfAmi: 15,
      householdSize: 8,
      income: 28980,
    },
  ],
}

// Preferences
const liveWorkPreference: Omit<PreferenceCreateDto, "listing"> = {
  ordinal: 1,
  page: 1,
  title: "Live/Work in County",
  subtitle: "Live/Work in County subtitle",
  description: "At least one household member lives or works in County",
  links: [
    {
      title: "Link Title",
      url: "example.com",
    },
  ],
  formMetadata: {
    key: "liveWork",
    options: [
      {
        key: "live",
        extraData: [],
      },
      {
        key: "work",
        extraData: [],
      },
    ],
  },
}

const displaceePreference: Omit<PreferenceCreateDto, "listing"> = {
  ordinal: 1,
  page: 1,
  title: "Displacee Tenant Housing",
  subtitle: "Displacee Tenant Housing subtitle",
  description:
    "At least one member of my household was displaced from a residential property due to redevelopment activity by Housing Authority or City.",
  links: [],
  formMetadata: {
    key: "displacedTenant",
    options: [
      {
        key: "general",
        extraData: [
          {
            key: "name",
            type: InputType.text,
          },
          {
            key: "address",
            type: InputType.address,
          },
        ],
      },
      {
        key: "missionCorridor",
        extraData: [
          {
            key: "name",
            type: InputType.text,
          },
          {
            key: "address",
            type: InputType.address,
          },
        ],
      },
    ],
  },
}

const pbvPreference: Omit<PreferenceCreateDto, "listing"> = {
  page: 1,
  ordinal: 1,
  title: "Housing Authority Project-Based Voucher",
  subtitle: "",
  description:
    "You are currently applying to be in a general applicant waiting list. Of the total apartments available in this application process, several have Project-Based Vouchers for rental subsidy assistance from the Housing Authority. With that subsidy, tenant households pay 30% of their income as rent. These tenants are required to verify their income annually with the property manager as well as the Housing Authority.",
  links: [],
  formMetadata: {
    key: "PBV",
    customSelectText: "Please select any of the following that apply to you",
    hideGenericDecline: true,
    hideFromListing: true,
    options: [
      {
        key: "residency",
        extraData: [],
      },
      {
        key: "family",
        extraData: [],
      },
      {
        key: "veteran",
        extraData: [],
      },
      {
        key: "homeless",
        extraData: [],
      },
      {
        key: "noneApplyButConsider",
        exclusive: true,
        description: false,
        extraData: [],
      },
      {
        key: "doNotConsider",
        exclusive: true,
        description: false,
        extraData: [],
      },
    ],
  },
}

const hopwaPreference: Omit<PreferenceCreateDto, "listing"> = {
  page: 1,
  ordinal: 1,
  title: "Housing Opportunities for Persons with AIDS",
  subtitle: "",
  description:
    "There are apartments set-aside for households eligible for the HOPWA program (Housing Opportunities for Persons with AIDS), which are households where a person has been medically diagnosed with HIV/AIDS. These apartments also have Project-Based Section rental subsidies (tenant pays 30% of household income).",
  links: [],
  formMetadata: {
    key: "HOPWA",
    customSelectText:
      "Please indicate if you are interested in applying for one of these HOPWA apartments",
    hideGenericDecline: true,
    hideFromListing: true,
    options: [
      {
        key: "hopwa",
        extraData: [],
      },
      {
        key: "doNotConsider",
        exclusive: true,
        description: false,
        extraData: [],
      },
    ],
  },
}

const defaultPreferences: Array<Omit<PreferenceCreateDto, "listing">> = [
  {
    ordinal: 1,
    title: "Custom preference title (1)",
    subtitle: "",
    description: "Custom preference description (1)",
    links: [
      {
        title: "example.com",
        url: "https://example.com",
      },
      {
        title: "example2.com",
        url: "https://example2.com",
      },
    ],
    formMetadata: {
      key: "customPreference1",
      options: [
        {
          key: "customOption1",
          extraData: [],
        },
        {
          key: "customOption2",
          extraData: [],
        },
      ],
    },
    page: 1,
  },
  {
    ordinal: 2,
    title: "Custom preference title (2)",
    subtitle: "",
    description: "Custom preference description (2)",
    links: [
      {
        title: "example.com",
        url: "https://example.com",
      },
      {
        title: "example2.com",
        url: "https://example2.com",
      },
    ],
    formMetadata: {
      key: "customPreference2",
      options: [
        {
          key: "customOption1",
          extraData: [
            {
              key: "name",
              type: InputType.hhMemberSelect,
            },
            {
              key: "address",
              type: InputType.address,
            },
          ],
        },
        {
          key: "customOption2",
          extraData: [
            {
              key: "name",
              type: InputType.hhMemberSelect,
            },
            {
              key: "address",
              type: InputType.address,
            },
          ],
        },
      ],
    },
    page: 1,
  },
]

// Events
const defaultListingEvents: Array<Omit<ListingEventDto, "listing">> = [
  {
    startTime: getDate(10),
    endTime: getDate(10),
    note: "Custom open house event note",
    type: ListingEventType.openHouse,
    url: "example.com",
    label: "Custom Event URL Label",
  },
  {
    startTime: getDate(10),
    endTime: getDate(10),
    note: "Custom public lottery event note",
    type: ListingEventType.publicLottery,
    url: "example2.com",
    label: "Custom Event URL Label",
  },
]

// Assets
const defaultAssets: Array<Omit<AssetDto, "listing">> = [
  {
    label: "building",
    fileId:
      "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
  },
]

// Properties
const defaultProperty: Omit<
  PropertyCreateDto,
  | "propertyGroups"
  | "listings"
  | "units"
  | "unitsSummarized"
  | "householdSizeMin"
  | "householdSizeMax"
> = {
  accessibility: "Custom accessibility text",
  amenities: "Custom property amenities text",
  buildingAddress: {
    city: "San Francisco",
    state: "CA",
    street: "548 Market Street",
    street2: "Suite #59930",
    zipCode: "94104",
    latitude: 37.789673,
    longitude: -122.40151,
  },
  buildingTotalUnits: 100,
  developer: "Developer",
  neighborhood: "Custom neighborhood text",
  petPolicy: "Custom pet text",
  servicesOffered: "Custom services offered text",
  smokingPolicy: "Custom smoking text",
  unitAmenities: "Custom unit amenities text",
  unitsAvailable: 2,
  yearBuilt: 2021,
}

const tritonProperty: Omit<
  PropertyCreateDto,
  | "propertyGroups"
  | "listings"
  | "units"
  | "unitsSummarized"
  | "householdSizeMin"
  | "householdSizeMax"
> = {
  accessibility:
    "Accessibility features in common areas like lobby – wheelchair ramps, wheelchair accessible bathrooms and elevators.",
  amenities: "Gym, Clubhouse, Business Lounge, View Lounge, Pool, Spa",
  buildingAddress: {
    city: "Foster City",
    county: "San Mateo",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  buildingTotalUnits: 48,
  developer: "Thompson Dorfman, LLC",
  neighborhood: "Foster City",
  petPolicy:
    "Pets allowed except the following; pit bull, malamute, akita, rottweiler, doberman, staffordshire terrier, presa canario, chowchow, american bull dog, karelian bear dog, st bernard, german shepherd, husky, great dane, any hybrid or mixed breed of the aforementioned breeds. 50 pound weight limit. 2 pets per household limit. $500 pet deposit per pet. $60 pet rent per pet.",
  servicesOffered: null,
  smokingPolicy: "Non-Smoking",
  unitAmenities: "Washer and dryer, AC and Heater, Gas Stove",
  unitsAvailable: 4,
  yearBuilt: 2021,
}

// Unit Sets
const defaultUnits: Array<Omit<UnitCreateDto, "property">> = [
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "30",
    annualIncomeMax: "45600",
    annualIncomeMin: "36168",
    bmrProgramChart: false,
    floor: 1,
    maxOccupancy: 3,
    minOccupancy: 1,
    monthlyIncomeMin: "3014",
    monthlyRent: "1219",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: 1,
    numBedrooms: 1,
    number: null,
    priorityType: "Mobility and hearing",
    reservedType: null,
    sqFeet: "635",
    status: "available",
    unitType: "oneBdrm",
  },
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "30",
    annualIncomeMax: "66600",
    annualIncomeMin: "41616",
    bmrProgramChart: false,
    floor: 2,
    maxOccupancy: 5,
    minOccupancy: 2,
    monthlyIncomeMin: "3468",
    monthlyRent: "1387",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: 1,
    numBedrooms: 2,
    number: null,
    priorityType: "Mobility and hearing",
    reservedType: null,
    sqFeet: "748",
    status: "available",
    unitType: "twoBdrm",
  },
]

const tritonUnits: Array<Omit<UnitCreateDto, "property">> = [
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "120.0",
    annualIncomeMax: "177300.0",
    annualIncomeMin: "84696.0",
    floor: 1,
    maxOccupancy: 5,
    minOccupancy: 2,
    monthlyIncomeMin: "7058.0",
    monthlyRent: "3340.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 2,
    number: null,
    priorityType: null,
    reservedType: null,
    sqFeet: "1100",
    status: "occupied",
    unitType: "twoBdrm",
  },
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    reservedType: null,
    sqFeet: "750",
    status: "occupied",
    unitType: "oneBdrm",
  },
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    reservedType: null,
    sqFeet: "750",
    status: "occupied",
    unitType: "oneBdrm",
  },
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    reservedType: null,
    sqFeet: "750",
    status: "occupied",
    unitType: "oneBdrm",
  },
  {
    amiChart: defaultAmiChart as AmiChart,
    amiPercentage: "50.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "38952.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "3246.0",
    monthlyRent: "1575.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    reservedType: null,
    sqFeet: "750",
    status: "occupied",
    unitType: "oneBdrm",
  },
]

// Application Method Sets
const defaultApplicationMethods: Array<Omit<ApplicationMethodDto, "listing">> = [
  {
    type: ApplicationMethodType.POBox,
    acceptsPostmarkedApplications: false,
    label: "Label",
    externalReference: "",
  },
  {
    type: ApplicationMethodType.PaperPickup,
    acceptsPostmarkedApplications: false,
    label: "Label",
    externalReference: "",
  },
  {
    type: ApplicationMethodType.Internal,
    acceptsPostmarkedApplications: false,
    label: "Label",
    externalReference: "",
  },
]

const tritonApplicationMethods: Array<Omit<ApplicationMethodDto, "listing">> = [
  {
    type: ApplicationMethodType.FileDownload,
    acceptsPostmarkedApplications: false,
    externalReference: "https://bit.ly/2wH6dLF",
    label: "English",
  },
  {
    type: ApplicationMethodType.PaperPickup,
    acceptsPostmarkedApplications: false,
    label: "Label",
    externalReference: "",
  },
]

// Leasing Agent Sets
const defaultLeasingAgents: UserCreateDto[] = [
  {
    firstName: "First",
    lastName: "Last",
    middleName: "Middle",
    email: "leasing-agent@example.com",
    emailConfirmation: "leasing-agent@example.com",
    password: "Abcdef1",
    passwordConfirmation: "Abcdef1",
    dob: new Date(),
  },
]

// Listings
const defaultListing: Omit<
  ListingCreateDto,
  | keyof BaseEntity
  | "property"
  | "urlSlug"
  | "applicationMethods"
  | "events"
  | "assets"
  | "preferences"
  | "leasingAgents"
  | "showWaitlist"
> = {
  applicationAddress: {
    city: "San Francisco",
    state: "CA",
    street: "548 Market Street",
    street2: "Suite #59930",
    zipCode: "94104",
    latitude: 37.789673,
    longitude: -122.40151,
  },
  applicationDueDate: getDate(10),
  applicationFee: "20",
  applicationOpenDate: getDate(-10),
  applicationOrganization: "Application Organization",
  applicationPickUpAddress: {
    city: "San Francisco",
    state: "CA",
    street: "548 Market Street",
    street2: "Suite #59930",
    zipCode: "94104",
    latitude: 37.789673,
    longitude: -122.40151,
  },
  applicationPickUpAddressOfficeHours: "Custom pick up address office hours text",
  buildingSelectionCriteria: "example.com",
  costsNotIncluded: "Custom costs not included text",
  countyCode: CountyCode.alameda,
  creditHistory: "Custom credit history text",
  criminalBackground: "Custom criminal background text",
  CSVFormattingType: CSVFormattingType.basic,
  depositMax: "500",
  depositMin: "500",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  leasingAgentAddress: {
    city: "San Francisco",
    state: "CA",
    street: "548 Market Street",
    street2: "Suite #59930",
    zipCode: "94104",
    latitude: 37.789673,
    longitude: -122.40151,
  },
  leasingAgentEmail: "hello@exygy.com",
  leasingAgentName: "Leasing Agent Name",
  leasingAgentOfficeHours: "Custom leasing agent office hours",
  leasingAgentPhone: "(415) 992-7251",
  leasingAgentTitle: "Leasing Agent Title",
  name: "Default Listing Seed",
  postmarkedApplicationsReceivedByDate: null,
  programRules: "Custom program rules text",
  rentalAssistance: "Custom rental assistance text",
  rentalHistory: "Custom rental history text",
  requiredDocuments: "Custom required documents text",
  specialNotes: "Custom special notes text",
  status: ListingStatus.active,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  whatToExpect: {
    allInfoWillBeVerified: "Custom all info will be verified text",
    applicantsWillBeContacted: "Custom applicant will be contacted text",
    bePreparedIfChosen: "Custom be prepared if chosen text",
  },
}

const tritonListing: Omit<
  ListingCreateDto,
  | keyof BaseEntity
  | "property"
  | "urlSlug"
  | "applicationMethods"
  | "events"
  | "assets"
  | "preferences"
  | "leasingAgents"
  | "showWaitlist"
> = {
  applicationAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  applicationDueDate: getDate(10),
  applicationFee: "38.0",
  applicationOpenDate: getDate(-10),
  applicationOrganization: "Triton",
  applicationPickUpAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  applicationPickUpAddressOfficeHours: null,
  buildingSelectionCriteria:
    "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/The_Triton_BMR_rental_information.pdf",
  costsNotIncluded:
    "Residents responsible for PG&E, Internet, Utilities - water, sewer, trash, admin fee. Pet Deposit is $500 with a $60 monthly pet rent. Residents required to maintain a renter's insurance policy as outlined in the lease agreement. Rent is due by the 3rd of each month. Late fee is $50.00. Resident to pay $25 for each returned check or rejected electronic payment. For additional returned checks, resident will pay a charge of $50.00.",
  countyCode: CountyCode.alameda,
  creditHistory:
    "No collections, no bankruptcy, income is twice monthly rent A credit report will be completed on all applicants to verify credit ratings.\n\nIncome plus verified credit history will be entered into a credit scoring model to determine rental eligibility and security deposit levels. All decisions for residency are based on a system which considers credit history, rent history, income qualifications, and employment history. An approved decision based on the system does not automatically constittute an approval of residency. Applicant(s) and occupant(s) aged 18 years or older MUST also pass the criminal background check based on the criteria contained herein to be approved for residency. \n\nCredit recommendations other than an accept decision, will require a rental verification. Applications for residency will automatically be denied for the following reasons:\n\n- a. An outstanding debt to a previous landlord or an outstanding NSF check must be paid in full\n- b. An unsatisfied breach of a prior lease or a prior eviction of any applicant or occupant\n- c. More than four (4) late pays and two (2) NSF's in the last twenty-four (24) months",
  criminalBackground: null,
  CSVFormattingType: CSVFormattingType.basic,
  depositMax: "800",
  depositMin: "500",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  leasingAgentAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  leasingAgentEmail: "thetriton@legacypartners.com",
  leasingAgentName: "Francis Santos",
  leasingAgentOfficeHours: "Monday - Friday, 9:00 am - 5:00 pm",
  leasingAgentPhone: "650-437-2039",
  leasingAgentTitle: "Business Manager",
  name: "Test: Triton",
  postmarkedApplicationsReceivedByDate: null,
  programRules: null,
  rentalAssistance: null,
  rentalHistory: "No evictions",
  requiredDocuments:
    "Due at interview - Paystubs, 3 months’ bank statements, recent tax returns or non-tax affidavit, recent retirement statement, application to lease, application qualifying criteria, social security card, state or nation ID. For self-employed, copy of IRS Tax Return including schedule C and current or most recent clients. Unemployment if applicable. Child support/Alimony; current notice from DA office, a court order or a letter from the provider with copies of last two checks. Any other income etc",
  specialNotes: null,
  status: ListingStatus.active,
  waitlistCurrentSize: 400,
  waitlistMaxSize: 600,
  whatToExpect: null,
}

// Seeds
export const defaultListingSeed: ListingSeed = {
  amiChart: defaultAmiChart,
  applicationMethods: defaultApplicationMethods,
  assets: defaultAssets,
  leasingAgents: defaultLeasingAgents,
  listing: { ...defaultListing, name: "Test: Default, Two Preferences" },
  listingEvents: defaultListingEvents,
  preferences: [liveWorkPreference, { ...displaceePreference, ordinal: 2 }],
  property: defaultProperty,
  units: defaultUnits,
}

const defaultOnePreferenceSeed: ListingSeed = {
  amiChart: defaultAmiChart,
  applicationMethods: defaultApplicationMethods,
  assets: defaultAssets,
  leasingAgents: defaultLeasingAgents,
  listing: { ...defaultListing, name: "Test: Default, One Preference" },
  listingEvents: defaultListingEvents,
  preferences: [liveWorkPreference],
  property: defaultProperty,
  units: defaultUnits,
}

const defaultNoPreferencesSeed: ListingSeed = {
  amiChart: defaultAmiChart,
  applicationMethods: defaultApplicationMethods,
  assets: defaultAssets,
  leasingAgents: defaultLeasingAgents,
  listing: { ...defaultListing, name: "Test: Default, No Preferences" },
  listingEvents: defaultListingEvents,
  preferences: [],
  property: defaultProperty,
  units: defaultUnits,
}

const tritonListingSeed: ListingSeed = {
  amiChart: tritonAmiChart,
  applicationMethods: tritonApplicationMethods,
  assets: defaultAssets,
  leasingAgents: defaultLeasingAgents,
  listing: tritonListing,
  listingEvents: [],
  preferences: [liveWorkPreference],
  property: tritonProperty,
  units: tritonUnits,
}

export const allSeeds = [
  defaultListingSeed,
  defaultOnePreferenceSeed,
  defaultNoPreferencesSeed,
  tritonListingSeed,
]
