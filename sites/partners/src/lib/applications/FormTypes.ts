import { DateFieldValues, DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import { Language, IncomePeriod, ApplicationReviewStatus } from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../helpers"

export type Address = {
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
}

export type ApplicationTypes = {
  mailingAddress: Address
  sendMailToMailingAddress?: boolean
  language?: Language
  additionalPhoneNumber?: string
  additionalPhoneNumberType?: string
  contactPreferences?: string[]
  acceptedTerms?: YesNoAnswer
  incomePeriod?: IncomePeriod
  incomeVouchers?: string[]
  preferredUnit?: string[]
  householdExpectingChanges?: YesNoAnswer
  householdStudent?: YesNoAnswer
  accessibility: string[]
  demographics: {
    ethnicity?: string
    race?: string[]
    gender?: string
    sexualOrientation?: string
    spokenLanguage?: string
    howDidYouHear: string[]
  }
  alternateContact: {
    firstName?: string
    lastName?: string
    agency?: string
    emailAddress?: string
    phoneNumber?: string
    type?: string
    otherType?: string
    mailingAddress: Address
  }
  applicant: {
    firstName?: string
    middleName?: string
    lastName?: string
    emailAddress?: string
    workInRegion?: YesNoAnswer
    address: Address
    workAddress: Address
    phoneNumberType?: string
  }
  preferences?: Record<string, string | unknown>
  programs?: Record<string, string | unknown>
  reviewStatus?: ApplicationReviewStatus
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
