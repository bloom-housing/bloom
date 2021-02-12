import {
  ApplicationUpdate,
  ApplicantUpdate,
  Language,
  IncomePeriod,
  ApplicationSubmissionType,
  ApplicationStatus,
  Address,
  HouseholdMember,
  InputType,
} from "@bloom-housing/backend-core/types"

import { TimeFieldPeriod } from "@bloom-housing/ui-components"
import {
  FormTypes,
  YesNoAnswer,
  ApplicationTypes,
} from "../src/applications/PaperApplicationForm/FormTypes"
import moment from "moment"
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
  submissionType: ApplicationSubmissionType
}

/*
  Format data which comes from react-hook-form into correct API format.
*/

export const mapFormToApi = (data: FormData, listingId: string, editMode: boolean) => {
  const language: Language | null = data.application?.language ? data.application?.language : null

  const submissionDate: Date | null = (() => {
    const TIME_24H_FORMAT = "MM/DD/YYYY HH:mm:ss"

    // rename default (wrong property names)
    const { birthDay: submissionDay, birthMonth: submissionMonth, birthYear: submissionYear } =
      data.dateSubmitted || {}
    const { hours, minutes = 0, seconds = 0, period } = data?.timeSubmitted || {}

    if (!submissionDay || !submissionMonth || !submissionYear) return null

    const dateString = moment(
      `${submissionMonth}/${submissionDay}/${submissionYear} ${hours}:${minutes}:${seconds} ${period}`,
      "MM/DD/YYYY hh:mm:ss A"
    ).format(TIME_24H_FORMAT)

    const formattedDate = moment(dateString, TIME_24H_FORMAT).utc(true).toDate()

    return formattedDate
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
      applicantData?.workInRegion === YesNoAnswer.Yes,
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

  const preferences = (() => {
    const CLAIMED_KEY = "claimed"
    const preferencesFormData = data.application.preferences

    const keys = Object.keys(preferencesFormData)

    return keys.map((key) => {
      const currentPreference = preferencesFormData[key]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentPreferenceValues = Object.values(currentPreference) as Record<string, any>
      const claimed = currentPreferenceValues.map((c) => c.claimed).includes(true)

      const options = Object.keys(currentPreference).map((option) => {
        const currentOption = currentPreference[option]

        // count keys except claimed
        const extraKeys = Object.keys(currentOption).filter((item) => item !== CLAIMED_KEY)

        const response = {
          key: option,
          checked: currentOption[CLAIMED_KEY],
        }

        // assign extra data and detect data type
        if (extraKeys.length) {
          const extraData = extraKeys.map((extraKey) => {
            const type = (() => {
              if (typeof currentOption[extraKey] === "boolean") return InputType.boolean
              // if object includes "city" property, it should be an address
              if (Object.keys(currentOption[extraKey]).includes("city")) return InputType.address

              return InputType.text
            })()

            return {
              key: extraKey,
              type,
              value: currentOption[extraKey],
            }
          })

          Object.assign(response, { extraData })
        }

        return response
      })

      return {
        key,
        claimed,
        options,
      }
    })
  })()

  // additional phone
  const {
    additionalPhoneNumber: additionalPhoneNumberData,
    additionalPhoneNumberType: additionalPhoneNumberTypeData,
    mailingAddress: mailingAddressData,
    additionalPhoneNumber,
    contactPreferences,
    sendMailToMailingAddress,
    accessibility,
    demographics,
    preferredUnit,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const mailingAddress = getAddress(sendMailToMailingAddress, mailingAddressData)

  const alternateContact = data.application.alternateContact

  // send null instead of empty string
  alternateContact.emailAddress = alternateContact.emailAddress || null

  // pass blank address, not used for now everywhere
  const alternateAddress = getAddress(false, null)

  const { incomeMonth, incomeYear, householdMembers } = data

  const incomePeriod: IncomePeriod | null = data.application?.incomePeriod || null

  const income = incomePeriod === IncomePeriod.perMonth ? incomeMonth : incomeYear || null
  const incomeVouchers =
    data.application.incomeVouchers === YesNoAnswer.Yes
      ? true
      : data.application.incomeVouchers === YesNoAnswer.No
      ? false
      : null

  const acceptedTerms =
    data.application.acceptedTerms === YesNoAnswer.Yes
      ? true
      : data.application.acceptedTerms === YesNoAnswer.No
      ? false
      : null

  const submissionType = editMode ? data.submissionType : ApplicationSubmissionType.paper
  const status = ApplicationStatus.submitted

  const listing = {
    id: listingId,
  }

  // we need to add primary applicant
  const householdSize = householdMembers.length + 1 || 1

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

/*
  Format data which comes from the API into correct react-hook-form format.
*/

export const mapApiToForm = (applicationData: ApplicationUpdate) => {
  const submissionDate = applicationData.submissionDate
    ? moment(new Date(applicationData.submissionDate)).utc()
    : null

  const dateOfBirth = (() => {
    const { birthDay, birthMonth, birthYear } = applicationData.applicant

    return {
      birthDay,
      birthMonth,
      birthYear,
    }
  })()

  const incomePeriod = applicationData.incomePeriod
  const incomeMonth = incomePeriod === "perMonth" ? applicationData.income : null
  const incomeYear = incomePeriod === "perYear" ? applicationData.income : null

  const timeSubmitted = (() => {
    if (!submissionDate) return

    const hours = submissionDate.format("hh")
    const minutes = submissionDate.format("mm")
    const seconds = submissionDate.format("ss")
    const period = submissionDate.format("A").toLowerCase() as TimeFieldPeriod

    return {
      hours,
      minutes,
      seconds,
      period,
    }
  })()

  const dateSubmitted = (() => {
    if (!submissionDate) return null

    const birthMonth = submissionDate.format("MM")
    const birthDay = submissionDate.format("DD")
    const birthYear = submissionDate.format("YYYY")

    return {
      birthMonth,
      birthDay,
      birthYear,
    }
  })()

  const phoneNumber = applicationData.applicant.phoneNumber

  const preferences = (() => {
    const preferencesFormData = {}

    const preferencesApiData = applicationData.preferences

    preferencesApiData.forEach((item) => {
      const options = item.options.reduce((acc, curr) => {
        // extraData which comes from the API is an array, in the form we expect an object
        const extraData =
          curr?.extraData?.reduce((extraAcc, extraCurr) => {
            // value - it can be string or nested address object
            const value = extraCurr.value
            Object.assign(extraAcc, {
              [extraCurr.key]: value,
            })

            return extraAcc
          }, {}) || {}

        // each form option has "claimed" property - it's "checked" property in the API
        const claimed = curr.checked

        Object.assign(acc, {
          [curr.key]: {
            claimed,
            ...extraData,
          },
        })
        return acc
      }, {})

      Object.assign(preferencesFormData, {
        [item.key]: options,
      })
    })

    return preferencesFormData
  })()

  const application: ApplicationTypes = (() => {
    const {
      language,
      contactPreferences,
      sendMailToMailingAddress,
      mailingAddress,
      preferredUnit,
      accessibility,
      incomePeriod,
      demographics,
      additionalPhoneNumber,
      additionalPhoneNumberType,
      alternateContact,
    } = applicationData

    const incomeVouchers: YesNoAnswer =
      applicationData.incomeVouchers === null
        ? null
        : applicationData.incomeVouchers
        ? YesNoAnswer.Yes
        : YesNoAnswer.No

    const acceptedTerms: YesNoAnswer =
      applicationData.acceptedTerms === null
        ? null
        : applicationData.acceptedTerms
        ? YesNoAnswer.Yes
        : YesNoAnswer.No
    const workInRegion = applicationData.applicant.workInRegion as YesNoAnswer

    const applicant = {
      ...applicationData.applicant,
      workInRegion,
    }

    const result = {
      applicant,
      language,
      phoneNumber,
      additionalPhoneNumber,
      additionalPhoneNumberType,
      preferences,
      contactPreferences,
      sendMailToMailingAddress,
      mailingAddress,
      preferredUnit,
      accessibility,
      incomePeriod,
      incomeVouchers,
      demographics,
      acceptedTerms,
      alternateContact,
    }

    return result
  })()

  const values: FormTypes = {
    dateOfBirth,
    dateSubmitted,
    timeSubmitted,
    phoneNumber,
    incomeMonth,
    incomeYear,
    application,
  }

  return values
}
