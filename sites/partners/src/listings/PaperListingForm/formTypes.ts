import { LatitudeLongitude, TimeFieldPeriod } from "@bloom-housing/ui-components"
import {
  Program,
  ListingStatus,
  ListingApplicationAddressType,
  Unit,
  User,
  Listing,
  ListingEvent,
  PaperApplication,
  PaperApplicationCreate,
  UnitGroup,
  UnitGroupAmiLevel,
  ListingMarketingTypeEnum,
} from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../applications/PaperApplicationForm/FormTypes"

export enum AnotherAddressEnum {
  anotherAddress = "anotherAddress",
}

export type FormListing = Omit<Listing, "countyCode" | "unitSummaries" | "unitGroups"> & {
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
  arePostmarksConsidered?: YesNoAnswer
  canApplicationsBeDroppedOff?: YesNoAnswer
  canPaperApplicationsBePickedUp?: YesNoAnswer
  canApplicationsBeMailedIn?: YesNoAnswer
  digitalApplicationChoice?: YesNoAnswer
  listingFeatures?: string[]
  commonDigitalApplicationChoice?: YesNoAnswer
  paperApplicationChoice?: YesNoAnswer
  section8Choice?: YesNoAnswer
  referralOpportunityChoice?: YesNoAnswer
  dueDateQuestionChoice?: YesNoAnswer
  criteriaAttachType?: string
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
  marketingStartDate?: number
  postMarkDate?: {
    month: string
    day: string
    year: string
  }
  reviewOrderQuestion?: string
  waitlistOpenQuestion?: YesNoAnswer
  waitlistSizeQuestion?: YesNoAnswer
  whereApplicationsDroppedOff?: ListingApplicationAddressType | AnotherAddressEnum
  whereApplicationsPickedUp?: ListingApplicationAddressType | AnotherAddressEnum
  whereApplicationsMailedIn?: ListingApplicationAddressType | AnotherAddressEnum
  unitGroups?: TempUnitsSummary[]
  isVerified?: boolean
}

export const addressTypes = {
  ...ListingApplicationAddressType,
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
  applicationPickUpAddress: null,
  applicationPickUpAddressOfficeHours: "",
  applicationMailingAddress: null,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  assets: [],
  buildingSelectionCriteria: "",
  buildingSelectionCriteriaFile: null,
  criteriaAttachType: "",
  jurisdiction: undefined,
  costsNotIncluded: "",
  creditHistory: "",
  criminalBackground: "",
  depositMax: "0",
  depositMin: "0",
  depositHelperText: "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  displayWaitlistSize: false,
  events: [],
  images: [],
  listingFeatures: [],
  features: {},
  leasingAgentAddress: null,
  leasingAgentEmail: null,
  leasingAgentName: null,
  leasingAgentOfficeHours: "",
  leasingAgentPhone: null,
  leasingAgentTitle: "",
  marketingType: ListingMarketingTypeEnum.marketing,
  name: null,
  postMarkDate: null,
  postmarkedApplicationsReceivedByDate: null,
  listingPreferences: [],
  listingPrograms: [],
  programRules: "",
  rentalAssistance:
    "The property is subsidized by the Section 8 Project-Based Voucher Program. As a result, Housing Choice Vouchers, Section 8 and other valid rental assistance programs are not accepted by this property.",
  rentalHistory: "",
  requiredDocuments: "",
  status: ListingStatus.pending,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  isWaitlistOpen: null,
  waitlistOpenSpots: null,
  units: [],
  accessibility: "",
  amenities: "",
  buildingAddress: null,
  buildingTotalUnits: 0,
  developer: null,
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: "",
  region: null,
  petPolicy: "",
  smokingPolicy: "",
  unitsAvailable: 0,
  unitAmenities: "",
  servicesOffered: "",
  yearBuilt: null,
  urlSlug: undefined,
  showWaitlist: false,
  reviewOrderType: null,
  unitGroups: [],
  isVerified: false,
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

export type UnitGroupType = Omit<UnitGroup, "listingId"> & {
  listingId?: string
}

export interface TempUnitsSummary extends UnitGroupType {
  tempId?: number
  amiLevels: TempAmiLevel[]
  openWaitListQuestion?: string
}

export type TempEvent = ListingEvent & {
  tempId?: string
}

export type PaperApplicationHybrid = PaperApplication | PaperApplicationCreate

export type FormMetadata = {
  programs: Program[]
  units: TempUnit[]
  unitsSummaries?: TempUnitsSummary[]
  openHouseEvents: TempEvent[]
  profile: User
  latLong: LatitudeLongitude
  customMapPositionChosen: boolean
  unitGroups: UnitGroupType[]
}
