// AMI Charts
import {
  AssetDtoSeedType,
  ListingSeedType,
  PreferenceSeedType,
  PropertySeedType,
  UnitSeedType,
} from "./listings"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { InputType } from "../../shared/types/input-type"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { ListingEventType } from "../../listings/types/listing-event-type-enum"
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { ListingEventCreateDto } from "../../listings/dto/listing-event.dto"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { ListingReviewOrder } from "../../listings/types/listing-review-order-enum"
import { CountyCode } from "../../shared/types/county-code"
import { UserCreateDto } from "../../auth/dto/user-create.dto"

export const getDate = (days: number) => {
  const someDate = new Date()
  someDate.setDate(someDate.getDate() + days)
  return someDate
}

export function getDefaultAmiChart() {
  return JSON.parse(JSON.stringify(defaultAmiChart))
}

export const defaultAmiChart: AmiChartCreateDto = {
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

// Events
export function getDefaultListingEvents() {
  return JSON.parse(JSON.stringify(defaultListingEvents))
}

export const defaultListingEvents: Array<ListingEventCreateDto> = [
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
export function getDefaultAssets() {
  return JSON.parse(JSON.stringify(defaultAssets))
}

export const defaultAssets: Array<AssetDtoSeedType> = [
  {
    label: "building",
    fileId:
      "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
  },
]
// Properties
export function getDefaultProperty() {
  return JSON.parse(JSON.stringify(defaultProperty))
}

export const defaultProperty: PropertySeedType = {
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

// Unit Sets
export function getDefaultUnits() {
  return JSON.parse(JSON.stringify(defaultUnits))
}

export const defaultUnits: Array<UnitSeedType> = [
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
    sqFeet: "635",
    status: UnitStatus.available,
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
    sqFeet: "748",
    status: UnitStatus.available,
  },
]

export const defaultLeasingAgents: Omit<UserCreateDto, "jurisdictions">[] = [
  {
    firstName: "First",
    lastName: "Last",
    middleName: "Middle",
    email: "leasing-agent-1@example.com",
    emailConfirmation: "leasing-agent-1@example.com",
    password: "abcdef",
    passwordConfirmation: "Abcdef1",
    dob: new Date(),
  },
  {
    firstName: "First",
    lastName: "Last",
    middleName: "Middle",
    email: "leasing-agent-2@example.com",
    emailConfirmation: "leasing-agent-2@example.com",
    password: "abcdef",
    passwordConfirmation: "Abcdef1",
    dob: new Date(),
  },
]

// Listings
export function getDefaultListing() {
  return JSON.parse(JSON.stringify(defaultListing))
}

export const defaultListing: ListingSeedType = {
  applicationAddress: {
    city: "San Francisco",
    state: "CA",
    street: "548 Market Street",
    street2: "Suite #59930",
    zipCode: "94104",
    latitude: 37.789673,
    longitude: -122.40151,
  },
  countyCode: CountyCode.alameda,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  applicationMailingAddress: null,
  applicationDueDate: getDate(10),
  applicationDueTime: null,
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
  reviewOrderType: "lottery" as ListingReviewOrder,
  specialNotes: "Custom special notes text",
  status: ListingStatus.active,
  waitlistCurrentSize: null,
  waitlistOpenSpots: null,
  isWaitlistOpen: false,
  waitlistMaxSize: null,
  whatToExpect: "Custom what to expect text",
}

// Preferences
export function getLiveWorkPreference() {
  return JSON.parse(JSON.stringify(liveWorkPreference))
}

export const liveWorkPreference: PreferenceSeedType = {
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
export function getDisplaceePreference() {
  return JSON.parse(JSON.stringify(displaceePreference))
}

export const displaceePreference: PreferenceSeedType = {
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

export function getPbvPreference() {
  return JSON.parse(JSON.stringify(pbvPreference))
}

export const pbvPreference: PreferenceSeedType = {
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

export function getHopwaPreference() {
  return JSON.parse(JSON.stringify(hopwaPreference))
}

export const hopwaPreference: PreferenceSeedType = {
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
