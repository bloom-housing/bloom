import { ApplicationUpdate, ApplicantUpdate, Language } from "@bloom-housing/core"

/*
  Some of fields are optional, not active, so it occurs 'undefined' as value.
  This function eliminates those fields and parse to a proper format.
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatApplicationData = (data: any, editMode: boolean) => {
  console.log(data)
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
    const { applicant: applicantData } = data.application
    const phoneNumberType = applicantData.phoneNumberType ? applicantData.phoneNumberType : null
    const noEmail = !applicantData.emailAddress
    const noPhone = !applicantData.phoneNumber

    return {
      ...applicantData,
      ...data.dateOfBirth,
      phoneNumberType,
      noEmail,
      noPhone,
    }
  })()

  // additional phone
  const {
    additionalPhoneNumber: additionalPhoneNumberData,
    additionalPhoneNumberType: additionalPhoneNumberTypeData,
    additionalPhoneNumber,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const result: ApplicationUpdate = {
    createdAt,
    language,
    applicant,
    additionalPhone,
    additionalPhoneNumber,
    additionalPhoneNumberType,
  }

  return result
}
