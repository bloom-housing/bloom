// AMI Charts
import {
  AssetDtoSeedType,
  ListingSeedType,
  PreferenceSeedType,
  ProgramSeedType,
  PropertySeedType,
  UnitSeedType,
} from "./listings"
import { defaultAmiChart } from "../ami-charts/default-ami-chart"
import { ListingEventCreateDto } from "../../../listings/dto/listing-event.dto"
import { ListingEventType } from "../../../listings/types/listing-event-type-enum"
import { AmiChart } from "../../../ami-charts/entities/ami-chart.entity"
import { UnitStatus } from "../../../units/types/unit-status-enum"
import { UserCreateDto } from "../../../auth/dto/user-create.dto"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingReviewOrder } from "../../../listings/types/listing-review-order-enum"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { InputType } from "../../../shared/types/input-type"
import { FormMetaDataType } from "../../../applications/types/form-metadata/form-metadata"
import { ListingMarketingTypeEnum } from "../../../listings/types/listing-marketing-type-enum"
export const getDate = (days: number) => {
  const someDate = new Date()
  someDate.setDate(someDate.getDate() + days)
  return someDate
}

export enum PriorityTypes {
  mobility = "Mobility",
  hearing = "Hearing",
  visual = "Visual",
  hearingVisual = "Hearing and Visual",
  mobilityHearing = "Mobility and Hearing",
  mobilityVisual = "Mobility and Visual",
  mobilityHearingVisual = "Mobility, Hearing and Visual",
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
    url: "https://www.example.com",
    label: "Custom Event URL Label",
  },
  {
    startTime: getDate(10),
    endTime: getDate(10),
    note: "Custom public lottery event note",
    type: ListingEventType.publicLottery,
    url: "https://www.example2.com",
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
  jurisdictionName: "Alameda",
  countyCode: CountyCode.alameda,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  applicationMailingAddress: null,
  digitalApplication: false,
  commonDigitalApplication: false,
  paperApplication: false,
  referralOpportunity: false,
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
  buildingSelectionCriteria: "https://www.example.com",
  costsNotIncluded: "Custom costs not included text",
  creditHistory: "Custom credit history text",
  criminalBackground: "Custom criminal background text",
  depositMax: "500",
  depositMin: "500",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  images: [],
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
  listingPreferences: [],
  listingPrograms: [],
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
  marketingType: ListingMarketingTypeEnum.Marketing,
}

// Preferences
export function getLiveWorkPreference(jurisdictionName) {
  const preference = { ...liveWorkPreference }
  preference.title += ` - ${jurisdictionName}`
  return preference
}

export const liveWorkPreference: PreferenceSeedType = {
  title: "Live/Work in County",
  subtitle: "Live/Work in County subtitle",
  description: "At least one household member lives or works in County",
  links: [
    {
      title: "Link Title",
      url: "https://www.example.com",
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
export function getDisplaceePreference(jurisdictionName) {
  const preference = { ...displaceePreference }
  preference.title += ` - ${jurisdictionName}`
  return preference
}

export const displaceePreference: PreferenceSeedType = {
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

export function getPbvPreference(jurisdictionName) {
  const preference = { ...pbvPreference }
  preference.title += ` - ${jurisdictionName}`
  return preference
}

export const pbvPreference: PreferenceSeedType = {
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

export function getHopwaPreference(jurisdictionName) {
  const preference = { ...hopwaPreference }
  preference.title += ` - ${jurisdictionName}`
  return preference
}

export const hopwaPreference: PreferenceSeedType = {
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

// programs

export function getServedInMilitaryProgram() {
  return JSON.parse(JSON.stringify(servedInMilitaryProgram))
}

export function getFlatRentAndRentBasedOnIncomeProgram() {
  return JSON.parse(JSON.stringify(flatRentAndRentBasedOnIncomeProgram))
}

export const servedInMilitaryProgram: ProgramSeedType = {
  title: "Veteran",
  subtitle: "Should your application be chosen, be prepared to provide supporting documentation.",
  description: "Have you or anyone in your household served in the US military?",
  formMetadata: {
    key: "servedInMilitary",
    options: [
      {
        key: "servedInMilitary",
        description: false,
        extraData: [],
      },
      {
        key: "doNotConsider",
        description: false,
        extraData: [],
      },
      {
        key: "preferNotToSay",
        description: false,
        extraData: [],
      },
    ],
  },
}

export const flatRentAndRentBasedOnIncomeProgram: ProgramSeedType = {
  title: "Flat Rent & Rent Based on Income",
  subtitle:
    "This property includes two types of affordable housing programs. You can choose to apply for one or both programs. Each program will have its own applicant list. Your choice will tell us which list(s) to put your name on. Additional information on each of the two types of housing opportunities are below.",
  description: "Do you want to apply for apartments with flat rent and rent based on income?",
  formMetadata: {
    key: "rentBasedOnIncome",
    type: FormMetaDataType.checkbox,
    options: [
      {
        key: "flatRent",
        description: true,
        extraData: [],
      },
      {
        key: "30Percent",
        description: true,
        extraData: [],
      },
    ],
  },
}

export function getTayProgram() {
  return JSON.parse(JSON.stringify(tayProgram))
}

export const tayProgram: ProgramSeedType = {
  title: "Transition Age Youth",
  subtitle: "Should your application be chosen, be prepared to provide supporting documentation.",
  description:
    "Are you or anyone in your household a transition age youth (TAY) aging out of foster care?",
  formMetadata: {
    key: "tay",
    options: [
      {
        key: "tay",
        description: false,
        extraData: [],
      },
      {
        key: "doNotConsider",
        description: false,
        extraData: [],
      },
      {
        key: "preferNotToSay",
        description: false,
        extraData: [],
      },
    ],
  },
}

export function getDisabilityOrMentalIllnessProgram() {
  return JSON.parse(JSON.stringify(disabilityOrMentalIllnessProgram))
}

export const disabilityOrMentalIllnessProgram: ProgramSeedType = {
  title: "Developmental Disability",
  subtitle: "Should your application be chosen, be prepared to provide supporting documentation.",
  description:
    "Do you or anyone in your household have a developmental disability or mental illness?",
  formMetadata: {
    key: "disabilityOrMentalIllness",
    options: [
      {
        key: "disabilityOrMentalIllness",
        description: false,
        extraData: [],
      },
      {
        key: "doNotConsider",
        description: false,
        extraData: [],
      },
      {
        key: "preferNotToSay",
        description: false,
        extraData: [],
      },
    ],
  },
}

export function getHousingSituationProgram() {
  return JSON.parse(JSON.stringify(housingSituationProgram))
}

export const housingSituationProgram: ProgramSeedType = {
  title: "Housing Situation",
  subtitle: "",
  description:
    "Thinking about the past 30 days, do either of these describe your housing situation?",
  formMetadata: {
    key: "housingSituation",
    options: [
      {
        key: "notPermanent",
        description: true,
        extraData: [],
      },
      {
        key: "homeless",
        description: true,
        extraData: [],
      },
      {
        key: "doNotConsider",
        description: false,
        extraData: [],
      },
      {
        key: "preferNotToSay",
        description: false,
        extraData: [],
      },
    ],
  },
}
