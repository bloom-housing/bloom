import {
  ApplicationStatus,
  ApplicationSubmissionType,
  Language,
  ApplicationPreference,
  ApplicationProgram,
  Application,
} from "@bloom-housing/backend-core/types"

type BlankApplication = Omit<
  Application,
  | "status"
  | "incomePeriod"
  | "language"
  | "submissionType"
  | "applicant"
  | "listing"
  | "user"
  | "mailingAddress"
  | "alternateAddress"
  | "alternateContact"
  | "accessibility"
  | "demographics"
  | "householdMembers"
  | "preferredUnit"
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "appUrl"
  | "additionalPhone"
  | "additionalPhoneNumber"
  | "additionalPhoneNumberType"
  | "contactPreferences"
  | "householdSize"
  | "housingStatus"
  | "sendMailToMailingAddress"
  | "incomeVouchers"
  | "income"
  | "preferences"
  | "programs"
  | "acceptedTerms"
  | "submissionDate"
  | "markedAsDuplicate"
  | "confirmationCode"
>

export const blankApplication: BlankApplication = () => {
  return {
    loaded: false,
    autofilled: false,
    completedSections: 0,
    submissionType: ApplicationSubmissionType.electronical,
    language: Language.en,
    acceptedTerms: false,
    status: ApplicationStatus.submitted,
    applicant: {
      orderId: undefined,
      firstName: "",
      middleName: "",
      lastName: "",
      birthMonth: "",
      birthDay: "",
      birthYear: "",
      emailAddress: null,
      noEmail: false,
      phoneNumber: "",
      phoneNumberType: "",
      noPhone: false,
      workInRegion: null,
      address: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
        county: "",
        latitude: null,
        longitude: null,
      },
      workAddress: {
        street: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
        county: "",
        latitude: null,
        longitude: null,
      },
    },
    additionalPhone: false,
    additionalPhoneNumber: "",
    additionalPhoneNumberType: "",
    contactPreferences: [],
    householdSize: 0,
    housingStatus: "",
    sendMailToMailingAddress: false,
    mailingAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    alternateAddress: {
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    alternateContact: {
      type: "",
      otherType: "",
      firstName: "",
      lastName: "",
      agency: "",
      phoneNumber: "",
      emailAddress: null,
      mailingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    accessibility: {
      mobility: null,
      vision: null,
      hearing: null,
    },
    householdExpectingChanges: null,
    householdStudent: null,
    incomeVouchers: null,
    income: null,
    incomePeriod: null,
    householdMembers: [],
    preferredUnit: [],
    demographics: {
      ethnicity: "",
      race: [],
      gender: "",
      sexualOrientation: "",
      howDidYouHear: [],
    },
    preferences: [] as ApplicationPreference[],
    programs: [] as ApplicationProgram[],
    confirmationCode: "",
    id: "",
  }
}
