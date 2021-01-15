import { DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import { NestedValue } from "react-hook-form"
import { Language, IncomePeriod } from "@bloom-housing/backend-core/types"

type Address = {
  street: string
  street2: string
  city: string
  state: string
  zipCode: string
}

export type YesNoAnswer = "yes" | "no"

export type FormTypes = {
  dateOfBirth: DOBFieldValues
  timeSubmitted: TimeFieldValues
  dateSubmitted: DOBFieldValues
  phoneNumber: string
  incomeYear?: string
  incomeMonth?: string
  application: NestedValue<{
    mailingAddress: NestedValue<Address>
    sendMailToMailingAddress: boolean
    language: Language
    additionalPhoneNumber: string
    additionalPhoneNumberType: string
    contactPreferences: string[]
    acceptedTerms: YesNoAnswer
    incomePeriod: IncomePeriod
    incomeVouchers: YesNoAnswer
    preferredUnit: string[]
    accessibility: NestedValue<{
      mobility: boolean
      vision: boolean
      hearing: boolean
    }>
    demographics: NestedValue<{
      ethnicity: string
      race: string
      gender: string
      sexualOrientation: string
      howDidYouHear: string[]
    }>
    alternateContact: NestedValue<{
      firstName: string
      lastName: string
      agency: string
      emailAddress: string
      phoneNumber: string
      type: string
      otherType?: string
      mailingAddress: NestedValue<Address>
    }>

    applicant: NestedValue<{
      firstName: string
      middleName: string
      lastName: string
      emailAddress: string
      workInRegion: YesNoAnswer
      address: NestedValue<Address>
      workAddress: NestedValue<Address>
      phoneNumberType?: string
    }>
    preferences: NestedValue<{
      liveIn: boolean
      workIn: boolean
      none: boolean
    }>
  }>
}
