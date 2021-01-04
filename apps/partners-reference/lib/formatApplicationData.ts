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

function getAddress(condition, addressData) {
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

  return condition ? addressData : blankAddress
}

export const formatApplicationData = (data: any, listingId, editMode: boolean) => {
  const language: Language = data.application.language ? data.application.language : null

  // create createdAt date
  const submissionDate: Date | null = (() => {
    const { birthDay: submissionDay, birthMonth: submissionMonth, birthYear: submissionYear } =
      data.dateSubmitted || {}
    const { hours, minutes = 0, seconds = 0, time } = data.timeSubmitted || {}

    if (!submissionDay || !submissionMonth || !submissionYear) return null

    const date = new Date()

    date.setUTCDate(submissionDay)
    date.setUTCMonth(submissionMonth)
    date.setUTCFullYear(submissionYear)

    if (hours && minutes && seconds && time) {
      date.setUTCHours(hours, minutes, seconds)
    } else {
      date.setUTCHours(0, 0, 0, 0)
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
    const workInRegion = applicantData?.workInRegion ? applicantData?.workInRegion : null
    const emailAddress = applicantData?.emailAddress ? applicantData?.emailAddress : null

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

  const incomePeriod = data.application.incomePeriod ? data.application.incomePeriod : null

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
