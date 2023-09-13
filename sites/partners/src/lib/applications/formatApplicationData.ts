import {
  ApplicationUpdate,
  ApplicantUpdate,
  Language,
  IncomePeriod,
  ApplicationSubmissionType,
  ApplicationStatus,
  AddressUpdate,
  HouseholdMember,
  MultiselectQuestion,
  Accessibility,
  ApplicationSection,
  Listing,
} from "@bloom-housing/backend-core/types"

import { TimeFieldPeriod } from "@bloom-housing/ui-components"
import {
  fieldGroupObjectToArray,
  adaFeatureKeys,
  mapApiToMultiselectForm,
  mapCheckboxesToApi,
  mapRadiosToApi,
  getInputType,
} from "@bloom-housing/shared-helpers"
import { FormTypes, ApplicationTypes, Address } from "../../lib/applications/FormTypes"
import { YesNoAnswer } from "../../lib/helpers"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import customParseFormat from "dayjs/plugin/customParseFormat"
import { ListingMultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
dayjs.extend(customParseFormat)

/*
  Some of fields are optional, not active, so it occurs 'undefined' as value.
  This function eliminates those fields and parse to a proper format.
*/

const getAddress = (condition: boolean, addressData?: Address): AddressUpdate => {
  const blankAddress: AddressUpdate = {
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  }

  return condition ? (addressData as AddressUpdate) : blankAddress
}

const getBooleanValue = (applicationField: YesNoAnswer) => {
  return applicationField === null ? null : applicationField === YesNoAnswer.Yes ? true : false
}

const getYesNoValue = (applicationField: boolean) => {
  return applicationField === null ? null : applicationField ? YesNoAnswer.Yes : YesNoAnswer.No
}

const mapEmptyStringToNull = (value: string) => (value === "" ? null : value)

interface FormData extends FormTypes {
  householdMembers: HouseholdMember[]
  submissionType: ApplicationSubmissionType
}

type mapFormToApiProps = {
  data: FormData
  listingId: string
  editMode: boolean
  programs: MultiselectQuestion[]
  preferences: MultiselectQuestion[]
}

/*
  Format data which comes from react-hook-form into correct API format.
*/

export const mapFormToApi = ({
  data,
  listingId,
  editMode,
  programs,
  preferences,
}: mapFormToApiProps) => {
  const language: Language | null = data.application?.language ? data.application?.language : null

  const submissionDate: Date | null = (() => {
    const TIME_24H_FORMAT = "MM/DD/YYYY HH:mm:ss"

    // rename default (wrong property names)
    const {
      day: submissionDay,
      month: submissionMonth,
      year: submissionYear,
    } = data.dateSubmitted || {}
    const { hours, minutes = 0, seconds = 0, period } = data?.timeSubmitted || {}

    if (!submissionDay || !submissionMonth || !submissionYear) return null

    const dateString = dayjs(
      `${submissionMonth}/${submissionDay}/${submissionYear} ${hours}:${minutes}:${seconds} ${period}`,
      "MM/DD/YYYY hh:mm:ss A"
    ).format(TIME_24H_FORMAT)

    const formattedDate = dayjs(dateString, TIME_24H_FORMAT).utc(true).toDate()

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

    applicantData.firstName = mapEmptyStringToNull(applicantData.firstName)
    applicantData.lastName = mapEmptyStringToNull(applicantData.lastName)

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

  const preferencesData = preferences.map((pref: MultiselectQuestion) => {
    const inputType = getInputType(pref.options)
    if (inputType === "checkbox") {
      return mapCheckboxesToApi(data, pref, ApplicationSection.preferences)
    }
    if (inputType === "radio") {
      return mapRadiosToApi(
        { [pref.text]: data.application.preferences[pref.text] as string },
        pref
      )
    }
  })

  const programsData = programs.map((program: MultiselectQuestion) => {
    const inputType = getInputType(program.options)
    if (inputType === "checkbox") {
      return mapCheckboxesToApi(data, program, ApplicationSection.programs)
    }
    if (inputType === "radio") {
      return mapRadiosToApi(
        { [program.text]: data.application.programs[program.text] as string },
        program
      )
    }
  })

  // additional phone
  const {
    additionalPhoneNumber: additionalPhoneNumberData,
    additionalPhoneNumberType: additionalPhoneNumberTypeData,
    mailingAddress: mailingAddressData,
    additionalPhoneNumber,
    contactPreferences,
    sendMailToMailingAddress,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const demographics = {
    ...data.application.demographics,
    race: fieldGroupObjectToArray(data, "race"),
  }

  const mailingAddress = getAddress(sendMailToMailingAddress, mailingAddressData)

  const alternateContact = data.application.alternateContact

  // send null instead of empty string
  alternateContact.emailAddress = alternateContact.emailAddress || null

  // pass blank address, not used for now everywhere
  const alternateAddress = getAddress(false, null)

  const { incomeMonth, incomeYear, householdMembers } = data

  const incomePeriod: IncomePeriod | null = data.application?.incomePeriod || null

  const income = incomePeriod === IncomePeriod.perMonth ? incomeMonth : incomeYear || null
  const incomeVouchers = getBooleanValue(data.application.incomeVouchers)
  const acceptedTerms = getBooleanValue(data.application.acceptedTerms)
  const householdExpectingChanges = getBooleanValue(data.application.householdExpectingChanges)
  const householdStudent = getBooleanValue(data.application.householdStudent)

  const submissionType = editMode ? data.submissionType : ApplicationSubmissionType.paper
  const status = ApplicationStatus.submitted

  const listing = {
    id: listingId,
  }

  // we need to add primary applicant
  const householdSize = householdMembers.length + 1 || 1
  let preferredUnit: Record<"id", string>[] = []

  if (data.application?.preferredUnit) {
    if (Array.isArray(data.application?.preferredUnit)) {
      preferredUnit = data.application.preferredUnit.map((id) => ({ id }))
    } else {
      preferredUnit = [{ id: data.application.preferredUnit }]
    }
  }

  const accessibility: Omit<Accessibility, "id" | "createdAt" | "updatedAt"> =
    adaFeatureKeys.reduce((acc, feature) => {
      acc[feature] = data.application.accessibility.includes(feature)
      return acc
    }, {})

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
    householdExpectingChanges,
    householdStudent,
    preferences: preferencesData,
    programs: programsData,
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

export const mapApiToForm = (applicationData: ApplicationUpdate, listing: Listing) => {
  const submissionDate = applicationData.submissionDate
    ? dayjs(new Date(applicationData.submissionDate)).utc()
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

    const month = submissionDate.format("MM")
    const day = submissionDate.format("DD")
    const year = submissionDate.format("YYYY")

    return {
      month,
      day,
      year,
    }
  })()

  const phoneNumber = applicationData.applicant.phoneNumber

  const preferences =
    mapApiToMultiselectForm(
      applicationData.preferences,
      listing?.listingMultiselectQuestions as unknown as ListingMultiselectQuestion[],
      ApplicationSection.preferences
    ).application.preferences ?? []

  const programs =
    mapApiToMultiselectForm(
      applicationData.programs,
      listing?.listingMultiselectQuestions as unknown as ListingMultiselectQuestion[],
      ApplicationSection.programs
    ).application.programs ?? []

  const application: ApplicationTypes = (() => {
    const {
      language,
      contactPreferences,
      sendMailToMailingAddress,
      mailingAddress,
      incomePeriod,
      demographics,
      additionalPhoneNumber,
      additionalPhoneNumberType,
      alternateContact,
    } = applicationData

    const incomeVouchers = getYesNoValue(applicationData.incomeVouchers)
    const acceptedTerms = getYesNoValue(applicationData.acceptedTerms)
    const householdExpectingChanges = getYesNoValue(applicationData.householdExpectingChanges)
    const householdStudent = getYesNoValue(applicationData.householdStudent)

    const workInRegion = applicationData.applicant.workInRegion as YesNoAnswer

    const applicant = {
      ...applicationData.applicant,
      workInRegion,
    }

    const preferredUnit = applicationData?.preferredUnit?.map((unit) => unit.id)

    const accessibility: string[] = adaFeatureKeys.filter(
      (feature) => applicationData?.accessibility[feature] === true
    )

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
      householdExpectingChanges,
      householdStudent,
      incomePeriod,
      incomeVouchers,
      demographics,
      acceptedTerms,
      alternateContact,
      programs,
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
