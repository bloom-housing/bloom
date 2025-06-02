import { LatitudeLongitude, TimeFieldPeriod } from "@bloom-housing/ui-components"
import {
  ApplicationAddressTypeEnum,
  Listing,
  ListingEvent,
  ListingsStatusEnum,
  MultiselectQuestion,
  PaperApplication,
  PaperApplicationCreate,
  Unit,
  UnitGroup,
  UnitGroupAmiLevel,
  User,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export enum AnotherAddressEnum {
  anotherAddress = "anotherAddress",
}

export type FormListing = Omit<Listing, "countyCode"> & {
  applicationDueDateField?: {
    month: string
    day: string
    year: string
  }
  applicationDueTimeField?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  postmarkByDateDateField?: {
    month: string
    day: string
    year: string
  }
  postmarkByDateTimeField?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  arePostmarksConsidered?: YesNoEnum
  canApplicationsBeDroppedOff?: YesNoEnum
  canPaperApplicationsBePickedUp?: YesNoEnum
  canApplicationsBeMailedIn?: YesNoEnum
  digitalApplicationChoice?: YesNoEnum
  commonDigitalApplicationChoice?: YesNoEnum
  paperApplicationChoice?: YesNoEnum
  referralOpportunityChoice?: YesNoEnum
  criteriaAttachType?: string
  includeCommunityDisclaimerQuestion?: YesNoEnum
  listingSection8Acceptance?: YesNoEnum
  communityDisclaimerTitle?: string
  communityDisclaimerDescription?: string
  lotteryDate?: {
    month: string
    day: string
    year: string
  }
  lotteryStartTime?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  lotteryEndTime?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  lotteryDateNotes?: string
  postMarkDate?: {
    month: string
    day: string
    year: string
  }
  marketingStartDate?: number
  reviewOrderQuestion?: string
  lotteryOptInQuestion?: YesNoEnum
  listingAvailabilityQuestion?: string
  waitlistOpenQuestion?: YesNoEnum
  waitlistSizeQuestion?: YesNoEnum
  whereApplicationsDroppedOff?: ApplicationAddressTypeEnum | AnotherAddressEnum
  whereApplicationsPickedUp?: ApplicationAddressTypeEnum | AnotherAddressEnum
  whereApplicationsMailedIn?: ApplicationAddressTypeEnum | AnotherAddressEnum
  accessibilityFeatures?: string[]
  utilities?: string[]
}

export const addressTypes = {
  ...ApplicationAddressTypeEnum,
  anotherAddress: AnotherAddressEnum.anotherAddress,
}

export type AlertErrorType = "api" | "form"

export const formDefaults: FormListing = {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  applicationDueDate: null,
  applicationFee: null,
  applicationMethods: [],
  applicationOpenDate: new Date(),
  applicationOrganization: "",
  listingsApplicationPickUpAddress: null,
  applicationPickUpAddressOfficeHours: "",
  listingsApplicationMailingAddress: null,
  listingsApplicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  assets: [],
  buildingSelectionCriteria: "",
  listingsBuildingSelectionCriteriaFile: null,
  criteriaAttachType: "",
  jurisdictions: undefined,
  costsNotIncluded: "",
  creditHistory: "",
  criminalBackground: "",
  depositMax: "0",
  depositMin: "0",
  depositHelperText: "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  displayWaitlistSize: false,
  listingEvents: [],
  listingImages: [],
  listingFeatures: null,
  listingNeighborhoodAmenities: null,
  listingUtilities: null,
  listingsLeasingAgentAddress: null,
  leasingAgentEmail: null,
  leasingAgentName: null,
  leasingAgentOfficeHours: "",
  leasingAgentPhone: null,
  leasingAgentTitle: "",
  managementWebsite: "",
  name: null,
  postMarkDate: null,
  postmarkedApplicationsReceivedByDate: null,
  listingMultiselectQuestions: [],
  programRules: "",
  rentalAssistance: null,
  rentalHistory: "",
  requiredDocuments: "",
  status: ListingsStatusEnum.pending,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  isWaitlistOpen: null,
  waitlistOpenSpots: null,
  units: [],
  accessibility: "",
  amenities: "",
  listingsBuildingAddress: null,
  buildingTotalUnits: 0,
  developer: null,
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: undefined,
  region: undefined,
  petPolicy: "",
  smokingPolicy: "",
  unitsAvailable: 0,
  unitAmenities: "",
  servicesOffered: "",
  yearBuilt: null,
  // urlSlug: undefined,
  // showWaitlist: false,
  reviewOrderType: null,
  unitsSummary: [],
  applicationLotteryTotals: [],
}

export type TempUnit = Unit & {
  tempId?: number
  maxIncomeHouseholdSize1?: string
  maxIncomeHouseholdSize2?: string
  maxIncomeHouseholdSize3?: string
  maxIncomeHouseholdSize4?: string
  maxIncomeHouseholdSize5?: string
  maxIncomeHouseholdSize6?: string
  maxIncomeHouseholdSize7?: string
  maxIncomeHouseholdSize8?: string
}

export type TempAmiLevel = UnitGroupAmiLevel & {
  tempId?: number
}

export type TempUnitGroup = Omit<UnitGroup, "unitGroupAmiLevels"> & {
  tempId?: number
  unitGroupAmiLevels: TempAmiLevel[]
}

export type TempEvent = ListingEvent & {
  tempId?: string
}

export type PaperApplicationHybrid = PaperApplication | PaperApplicationCreate

export type FormMetadata = {
  preferences: MultiselectQuestion[]
  programs: MultiselectQuestion[]
  units: TempUnit[]
  unitGroups: TempUnitGroup[]
  openHouseEvents: TempEvent[]
  profile: User
  latLong: LatitudeLongitude
  customMapPositionChosen: boolean
  enableUnitGroups: boolean
}
