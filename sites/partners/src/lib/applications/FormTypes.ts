import { DateFieldValues, DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type Address = {
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
}

export type ApplicationTypes = {
  applicationsMailingAddress: Address
  sendMailToMailingAddress?: boolean
  language?: LanguagesEnum
  additionalPhoneNumber?: string
  additionalPhoneNumberType?: string
  contactPreferences?: string[]
  acceptedTerms?: YesNoEnum
  incomePeriod?: IncomePeriodEnum
  incomeVouchers?: YesNoEnum
  preferredUnit?: string[]
  householdExpectingChanges?: YesNoEnum
  householdStudent?: YesNoEnum
  accessibility: string[]
  demographics: {
    ethnicity?: string
    race?: string[]
    gender?: string
    sexualOrientation?: string
    howDidYouHear: string[]
    spokenLanguage?: string
  }
  alternateContact: {
    firstName?: string
    lastName?: string
    agency?: string
    emailAddress?: string
    phoneNumber?: string
    type?: string
    otherType?: string
    address: Address
  }
  applicant: {
    firstName?: string
    middleName?: string
    lastName?: string
    emailAddress?: string
    workInRegion?: YesNoEnum
    fullTimeStudent?: YesNoEnum
    applicantAddress: Address
    applicantWorkAddress: Address
    phoneNumberType?: string
  }
  preferences?: Record<string, string | unknown>
  programs?: Record<string, string | unknown>
  reviewStatus?: ApplicationReviewStatusEnum
  status?: ApplicationStatusEnum
  phoneNumber?: string
  accessibleUnitWaitlistNumber?: number
  conventionalUnitWaitlistNumber?: number
  manualLotteryPositionNumber?: number
}

export type FormTypes = {
  dateOfBirth: DOBFieldValues
  timeSubmitted: TimeFieldValues
  dateSubmitted: DateFieldValues
  phoneNumber: string
  incomeYear?: string
  incomeMonth?: string
  application: ApplicationTypes
}
