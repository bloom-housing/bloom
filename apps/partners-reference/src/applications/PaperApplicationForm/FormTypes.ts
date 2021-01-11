import { FormApplicationDataFields } from "./sections/FormApplicationData"
import type { DOBFieldValues, TimeFieldValues } from "@bloom-housing/ui-components"
import {
  FormPrimaryApplicantFields,
  FormPrimaryApplicantWorkValues,
} from "./sections/FormPrimaryApplicant"
import { AlternateContactFields } from "./sections/FormAlternateContact"
import { FormHouseholdDetailsFields } from "./sections/FormHouseholdDetails"
import { FormPreferencesFields } from "./sections/FormPreferences"
import {
  FormHouseholdIncomeFields,
  IncomeVouchersOptionsType,
  FormHouseholdIncomePeriodType,
} from "./sections/FormHouseholdIncome"
import { FormDemographicsFields } from "./sections/FormDemographics"
import { FormTermsFields, FormTermsAcceptedValue } from "./sections/FormTerms"

export type FormValues = {
  [AlternateContactFields.FirstName]: string
  [AlternateContactFields.LastName]: string
  [AlternateContactFields.Agency]: string
  [AlternateContactFields.EmailAddress]: string
  [AlternateContactFields.PhoneNumber]: string
  [AlternateContactFields.Type]: string
  [AlternateContactFields.OtherType]: string
  [AlternateContactFields.MailingAddressStreet]: string
  [AlternateContactFields.MailingAddressStreet2]: string
  [AlternateContactFields.MailingAddressCity]: string
  [AlternateContactFields.MailingAddressState]: string
  [AlternateContactFields.MailingAddressZipCode]: string

  [FormApplicationDataFields.DateSubmitted]: DOBFieldValues
  [FormApplicationDataFields.TimeSubmitted]: TimeFieldValues
  [FormApplicationDataFields.Language]: string

  [FormDemographicsFields.Ethnicity]: string
  [FormDemographicsFields.Race]: string
  [FormDemographicsFields.Gender]: string
  [FormDemographicsFields.SexualOrientation]: string
  [FormDemographicsFields.HowDidYouHearAboutUs]: string[]

  [FormHouseholdDetailsFields.PreferredUnit]: string[]
  [FormHouseholdDetailsFields.Mobility]: boolean
  [FormHouseholdDetailsFields.Vision]: boolean
  [FormHouseholdDetailsFields.Hearing]: boolean

  [FormHouseholdIncomeFields.IncomePeriod]?: keyof typeof FormHouseholdIncomePeriodType
  [FormHouseholdIncomeFields.IncomeYear]?: string
  [FormHouseholdIncomeFields.IncomeMonth]?: string
  [FormHouseholdIncomeFields.IncomeVouchers]: IncomeVouchersOptionsType

  [FormPreferencesFields.LiveIn]: boolean
  [FormPreferencesFields.WorkIn]: boolean
  [FormPreferencesFields.None]: boolean

  [FormPrimaryApplicantFields.FirstName]: string
  [FormPrimaryApplicantFields.MiddleName]: string
  [FormPrimaryApplicantFields.LastName]: string
  [FormPrimaryApplicantFields.DateOfBirth]: DOBFieldValues
  [FormPrimaryApplicantFields.EmailAddress]: string
  [FormPrimaryApplicantFields.PhoneNumber]: string
  [FormPrimaryApplicantFields.PhoneNumberType]: string
  [FormPrimaryApplicantFields.AdditionalPhoneNumber]: string
  [FormPrimaryApplicantFields.AdditionalPhoneNumberType]: string
  [FormPrimaryApplicantFields.ContactPreferences]: string[]
  [FormPrimaryApplicantFields.WorkInRegion]: keyof typeof FormPrimaryApplicantWorkValues
  [FormPrimaryApplicantFields.AddressStreet]: string
  [FormPrimaryApplicantFields.AddressStreet2]: string
  [FormPrimaryApplicantFields.AddressCity]: string
  [FormPrimaryApplicantFields.AddressState]: string
  [FormPrimaryApplicantFields.AddressZip]: string
  [FormPrimaryApplicantFields.MailToMailingAddress]?: boolean
  [FormPrimaryApplicantFields.MailingAddressStreet]: string
  [FormPrimaryApplicantFields.MailingAddressStreet2]: string
  [FormPrimaryApplicantFields.MailingAddressCity]: string
  [FormPrimaryApplicantFields.MailingAddressState]: string
  [FormPrimaryApplicantFields.MailingAddressZip]: string
  [FormPrimaryApplicantFields.WorkAddressStreet]: string
  [FormPrimaryApplicantFields.WorkAddressStreet2]: string
  [FormPrimaryApplicantFields.WorkAddressCity]: string
  [FormPrimaryApplicantFields.WorkAddressState]: string
  [FormPrimaryApplicantFields.WorkAddressZip]: string

  [FormTermsFields.AcceptedTerms]?: keyof typeof FormTermsAcceptedValue
}
