import { DateFieldValues, TimeFieldPeriod, TimeFieldValues } from "@bloom-housing/ui-components"
import {
  fieldGroupObjectToArray,
  adaFeatureKeys,
  mapApiToMultiselectForm,
  mapCheckboxesToApi,
} from "@bloom-housing/shared-helpers"
import { FormTypes, ApplicationTypes, Address } from "../../lib/applications/FormTypes"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import customParseFormat from "dayjs/plugin/customParseFormat"
import {
  HouseholdMember,
  ApplicationSubmissionTypeEnum,
  MultiselectQuestion,
  LanguagesEnum,
  ApplicantUpdate,
  YesNoEnum,
  AddressCreate,
  IncomePeriodEnum,
  ApplicationStatusEnum,
  ApplicationUpdate,
  Accessibility,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
dayjs.extend(customParseFormat)

const TIME_24H_FORMAT = "MM/DD/YYYY HH:mm:ss"

/*
  Some of fields are optional, not active, so it occurs 'undefined' as value.
  This function eliminates those fields and parse to a proper format.
*/

const getAddress = (condition: boolean, addressData?: Address): AddressCreate => {
  const blankAddress: AddressCreate = {
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  }

  return condition ? (addressData as AddressCreate) : blankAddress
}

const getBooleanValue = (applicationField: YesNoEnum) => {
  return applicationField === null ? null : applicationField === YesNoEnum.yes ? true : false
}

const getYesNoValue = (applicationField: boolean) => {
  return applicationField === null ? null : applicationField ? YesNoEnum.yes : YesNoEnum.no
}

const mapEmptyStringToNull = (value: string) => (value === "" ? null : value)

interface FormData extends FormTypes {
  householdMembers: HouseholdMember[]
  submissionType: ApplicationSubmissionTypeEnum
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
  const language: LanguagesEnum | null = data.application?.language
    ? data.application?.language
    : null

  const getDateTime = (date: DateFieldValues, time: TimeFieldValues) => {
    let day = date?.day
    let month = date?.month
    const year = date?.year
    const { hours, minutes = 0, seconds = 0, period } = time || {}

    if (!day || !month || !year) return null

    if (month.length === 1) month = `0${month}`
    if (day.length === 1) day = `0${day}`

    const dateString = dayjs(
      `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${period}`,
      "MM/DD/YYYY hh:mm:ss a"
    ).format(TIME_24H_FORMAT)

    const formattedDate = dayjs(dateString, TIME_24H_FORMAT).toDate()

    return formattedDate
  }

  const submissionDate: Date | null = getDateTime(data?.dateSubmitted, data?.timeSubmitted)

  // create applicant
  const applicant = ((): ApplicantUpdate => {
    const phoneNumber: string | null = data?.phoneNumber || null
    const { applicant: applicantData } = data.application
    const phoneNumberType: string | null = applicantData.phoneNumberType || null
    const noEmail = !applicantData.emailAddress
    const noPhone = !phoneNumber
    const workInRegion: YesNoEnum | null = applicantData?.workInRegion || null
    const emailAddress: string | null = applicantData?.emailAddress || null

    applicantData.firstName = mapEmptyStringToNull(applicantData.firstName)
    applicantData.lastName = mapEmptyStringToNull(applicantData.lastName)

    const workAddress = getAddress(
      applicantData?.workInRegion === YesNoEnum.yes,
      applicantData?.applicantWorkAddress
    )

    return {
      ...applicantData,
      ...data.dateOfBirth,
      emailAddress,
      workInRegion,
      applicantWorkAddress: workAddress,
      phoneNumber,
      phoneNumberType,
      noEmail,
      noPhone,
    }
  })()

  const preferencesData = preferences.map((pref: MultiselectQuestion) => {
    return mapCheckboxesToApi(data, pref, MultiselectQuestionsApplicationSectionEnum.preferences)
  })

  const programsData = programs.map((program: MultiselectQuestion) => {
    return mapCheckboxesToApi(data, program, MultiselectQuestionsApplicationSectionEnum.programs)
  })

  // additional phone
  const {
    additionalPhoneNumber: additionalPhoneNumberData,
    additionalPhoneNumberType: additionalPhoneNumberTypeData,
    applicationsMailingAddress: mailingAddressData,
    additionalPhoneNumber,
    contactPreferences,
  } = data.application

  const additionalPhone = !additionalPhoneNumberData
  const additionalPhoneNumberType = additionalPhoneNumberTypeData
    ? additionalPhoneNumberTypeData
    : null

  const demographics = {
    ...data.application.demographics,
    race: fieldGroupObjectToArray(data, "race"),
  }

  const sendMailToMailingAddress = data.application.sendMailToMailingAddress

  const applicationsMailingAddress = getAddress(sendMailToMailingAddress, mailingAddressData)

  const alternateContact = data.application.alternateContact

  // send null instead of empty string
  alternateContact.emailAddress = alternateContact.emailAddress || null
  alternateContact.type = alternateContact.type || null

  // pass blank address, not used for now everywhere
  const alternateAddress = getAddress(false, null)

  const { incomeMonth, incomeYear, householdMembers } = data

  householdMembers.forEach((member) => {
    member.relationship = member.relationship || null
  })

  const incomePeriod: IncomePeriodEnum | null = data.application?.incomePeriod || null

  const income = incomePeriod === IncomePeriodEnum.perMonth ? incomeMonth : incomeYear || null
  const incomeVouchers = getBooleanValue(data.application.incomeVouchers)
  const acceptedTerms = getBooleanValue(data.application.acceptedTerms)
  const householdExpectingChanges = getBooleanValue(data.application.householdExpectingChanges)
  const householdStudent = getBooleanValue(data.application.householdStudent)

  const submissionType = editMode ? data.submissionType : ApplicationSubmissionTypeEnum.paper
  const status = ApplicationStatusEnum.submitted

  const listings = {
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

  const result = {
    submissionDate,
    language,
    applicant,
    additionalPhone,
    additionalPhoneNumber,
    additionalPhoneNumberType,
    contactPreferences,
    sendMailToMailingAddress,
    applicationsMailingAddress,
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
    listings,
    preferredUnitTypes: preferredUnit,
    applicationsAlternateAddress: alternateAddress,
    householdMember: householdMembers,
    householdSize,
  }

  return result
}

/*
  Format data which comes from the API into correct react-hook-form format.
*/

export const mapApiToForm = (applicationData: ApplicationUpdate, listing: Listing) => {
  const submissionDate = applicationData.submissionDate
    ? dayjs(new Date(applicationData.submissionDate))
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
    const period = submissionDate.format("a").toLowerCase() as TimeFieldPeriod

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
      listing?.listingMultiselectQuestions,
      MultiselectQuestionsApplicationSectionEnum.preferences
    ).application.preferences ?? []

  const programs =
    mapApiToMultiselectForm(
      applicationData.programs,
      listing?.listingMultiselectQuestions,
      MultiselectQuestionsApplicationSectionEnum.programs
    ).application.programs ?? []

  const application: ApplicationTypes = (() => {
    const {
      language,
      contactPreferences,
      sendMailToMailingAddress,
      applicationsMailingAddress,
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

    const workInRegion = applicationData.applicant.workInRegion

    const applicant = {
      ...applicationData.applicant,
      workInRegion,
    }

    const preferredUnit = applicationData?.preferredUnitTypes?.map((unit) => unit.id)

    const accessibility: string[] = adaFeatureKeys.filter(
      (feature) =>
        applicationData?.accessibility && applicationData?.accessibility[feature] === true
    )

    const result: ApplicationTypes = {
      applicant,
      language,
      phoneNumber,
      additionalPhoneNumber,
      additionalPhoneNumberType,
      preferences,
      contactPreferences,
      sendMailToMailingAddress,
      applicationsMailingAddress,
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
