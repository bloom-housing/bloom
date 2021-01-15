import {
  ApplicationUpdate,
  ApplicantUpdate,
  Language,
  IncomePeriod,
  ApplicationSubmissionType,
  ApplicationStatus,
  Address,
  HouseholdMember,
} from "@bloom-housing/backend-core/types"
import { FormTypes } from "../src/applications/PaperApplicationForm/FormTypes"

/*
  Some of fields are optional, not active, so it occurs 'undefined' as value.
  This function eliminates those fields and parse to a proper format.
*/

type GetAddressType = Omit<Address, "id" | "createdAt" | "updatedAt">

function getAddress(condition: boolean, addressData?: GetAddressType): GetAddressType {
  const blankAddress: GetAddressType = {
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  }

  return condition ? addressData : blankAddress
}

interface FormData extends FormTypes {
  householdMembers: HouseholdMember[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const formatApplicationData = (data: FormData, listingId: string, editMode: boolean) => {
  const language: Language | null = data.application?.language ? data.application?.language : null

  const submissionDate: Date | null = (() => {
    // rename default (wrong property names)
    const { birthDay: submissionDay, birthMonth: submissionMonth, birthYear: submissionYear } =
      data.dateSubmitted || {}
    const { hours, minutes = 0, seconds = 0, period } = data?.timeSubmitted || {}

    if (!submissionDay || !submissionMonth || !submissionYear) return null

    const date = new Date()

    date.setUTCDate(parseInt(submissionDay))
    date.setUTCMonth(parseInt(submissionMonth) - 1)
    date.setUTCFullYear(parseInt(submissionYear))

    if (hours && minutes && seconds && period) {
      const hourNumber = parseInt(hours, 10)
      const hour24Clock = period === "am" ? hourNumber : hourNumber + 12
      date.setUTCHours(hour24Clock, parseInt(minutes), parseInt(seconds))
    } else {
      date.setUTCHours(0, 0, 0, 0)
    }

    return date
  })()

  // create applicant
  const applicant = ((): ApplicantUpdate => {
    const phoneNumber: string | null = data?.phoneNumber || null
    const { applicant: applicantData } = data.application
    const phoneNumberType: string | null = applicantData.phoneNumberType || null
    const noEmail = !applicantData.emailAddress
    const noPhone = !phoneNumber
    const workInRegion: string | null = applicantData?.workInRegion || null
    const emailAddress: string | null = applicantData?.emailAddress || null

    const workAddress = getAddress(
      applicantData?.workInRegion === "yes",
      applicantData?.workAddress
    )

    return {
      ...applicantData,
      ...data.dateOfBirth,
      emailAddress,
      workInRegion,
      workAddress,
      phoneNumber,
      phoneNumberType,
      noEmail,
      noPhone,
    }
  })()

  // additional phone
  const {
    additionalPhoneNumber: additionalPhoneNumberData,
    additionalPhoneNumberType: additionalPhoneNumberTypeData,
    mailingAddress: mailingAddressData,
    additionalPhoneNumber,
    contactPreferences,
    sendMailToMailingAddress,
    alternateContact,
    accessibility,
    preferences,
    demographics,
    preferredUnit,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const mailingAddress = getAddress(sendMailToMailingAddress, mailingAddressData)

  // pass blank address, not used for now everywhere
  const alternateAddress = getAddress(false, null)

  const { incomeMonth, incomeYear, householdMembers } = data

  const incomePeriod: IncomePeriod | null = data.application?.incomePeriod || null

  const income = incomePeriod === IncomePeriod.perMonth ? incomeMonth : incomeYear || null
  const incomeVouchers =
    data.application.incomeVouchers === "yes"
      ? true
      : data.application.incomeVouchers === "no"
      ? false
      : null

  const acceptedTerms =
    data.application.acceptedTerms === "yes"
      ? true
      : data.application.acceptedTerms === "no"
      ? false
      : null

  const submissionType = ApplicationSubmissionType.paper
  const status = ApplicationStatus.submitted

  const listing = {
    id: listingId,
  }

  const householdSize = householdMembers.length || 1

  const result: ApplicationUpdate = {
    submissionDate,
    language,
    applicant,
    additionalPhone,
    additionalPhoneNumber,
    additionalPhoneNumberType,
    contactPreferences,
    sendMailToMailingAddress,
    mailingAddress,
    alternateContact,
    accessibility,
    preferences,
    income,
    incomePeriod,
    incomeVouchers,
    demographics,
    acceptedTerms,
    submissionType,
    status,
    listing,
    preferredUnit,
    alternateAddress,
    householdMembers,
    householdSize,
  }

  return result
}
