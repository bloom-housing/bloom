import { DateFieldValues, DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import { Language, IncomePeriod } from "@bloom-housing/backend-core/types"

export type Address = {
  street: string
  street2?: string
  city: string
  state: string
  zipCode: string
}

export enum YesNoAnswer {
  "Yes" = "yes",
  "No" = "no",
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
  incomeVouchers?: YesNoAnswer
  preferredUnit?: string[]
  accessibility: {
    mobility?: boolean
    vision?: boolean
    hearing?: boolean
  }
  demographics: {
    ethnicity?: string
    race?: string
    gender?: string
    sexualOrientation?: string
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: Record<string, any>
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
