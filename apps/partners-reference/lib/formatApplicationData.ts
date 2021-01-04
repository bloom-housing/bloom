import {
  ApplicationUpdate,
  ApplicantUpdate,
  Language,
  IncomePeriod,
  ApplicationSubmissionType,
  ApplicationStatus,
  Address,
} from "@bloom-housing/core"

/*
  Some of fields are optional, not active, so it occurs 'undefined' as value.
  This function eliminates those fields and parse to a proper format.
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatApplicationData = (data: any, listingId, editMode: boolean) => {
  const language: Language = data.application.language

  // create createdAt date
  const createdAt: Date | null = (() => {
    const { birthDay: submissionDay, birthMonth: submissionMonth, birthYear: submissionYear } =
      data.dateSubmitted || {}
    const { hours, minutes = 0, seconds = 0, time } = data.timeSubmitted || {}

    if (!submissionDay || !submissionMonth || !submissionYear) return null

    const date = new Date()

    date.setUTCDate(submissionDay)
    date.setUTCMonth(submissionMonth)
    date.setUTCFullYear(submissionYear)

    if (hours && minutes && seconds && time) {
      date.setUTCHours(hours)
      date.setUTCMinutes(minutes)
      date.setUTCSeconds(seconds)
    } else {
      date.setUTCHours(0)
      date.setUTCMinutes(0)
      date.setUTCSeconds(0)
    }

    return date
  })()

  // create applicant
  const applicant = ((): ApplicantUpdate => {
    const { phoneNumber } = data
    const { applicant: applicantData } = data.application
    const phoneNumberType = applicantData.phoneNumberType ? applicantData.phoneNumberType : null
    const noEmail = !applicantData.emailAddress
    const noPhone = !phoneNumber

    return {
      ...applicantData,
      ...data.dateOfBirth,
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
    incomePeriod,
    demographics,
    preferredUnit,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const mailingAddress = (() => {
    const blankAddress: Address = {
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    }

    return sendMailToMailingAddress ? mailingAddressData : blankAddress
  })()

  const alternateAddress: Address = data.application.alternateAddress

  const { incomeMonth, incomeYear, householdMembers } = data

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
  const status = editMode ? ApplicationStatus.submitted : ApplicationStatus.draft

  const listing = {
    id: listingId,
  }

  const result: ApplicationUpdate = {
    createdAt,
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
  }

  return result
}
