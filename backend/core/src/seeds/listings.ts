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
    page: 2,
  },
]

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

const defaultAssets: Array<Omit<AssetDto, "listing">> = [
  {
    label: "building",
    fileId:
      "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
  },
]

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
  neighborhood: null,
  petPolicy: "Custom pet text",
  smokingPolicy: "Custom smoking text",
  unitAmenities: "Custom unit amenities text",
  unitsAvailable: 2,
  yearBuilt: 2021,
}

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

const defaultListingAgents: UserCreateDto[] = [
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

export const defaultListingSeed: ListingSeed = {
  amiChart: defaultAmiChart,
  applicationMethods: defaultApplicationMethods,
  assets: defaultAssets,
  leasingAgents: defaultListingAgents,
  listing: defaultListing,
  listingEvents: defaultListingEvents,
  preferences: defaultPreferences,
  property: defaultProperty,
  units: defaultUnits,
}
