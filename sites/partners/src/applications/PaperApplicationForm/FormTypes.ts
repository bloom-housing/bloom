import { DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import { NestedValue } from "react-hook-form"
import { Language, IncomePeriod } from "@bloom-housing/core"

type Address = {
  street: string
  street2: string
  city: string
  state: string
  zipCode: string
}

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
    acceptedTerms: "yes" | "no"
    incomePeriod: IncomePeriod
    incomeVouchers: "yes" | "no"
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
      workInRegion: "yes" | "no"
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
