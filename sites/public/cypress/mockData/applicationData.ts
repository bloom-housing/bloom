import {
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
  Application,
  YesNoEnum,
  UnitTypeEnum,
  ApplicationMultiselectQuestion,
  AlternateContactRelationship,
  HouseholdMemberRelationship,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const idDefaults = {
  id: "abcd1234",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const contactPreferencesCheckboxesOrder = ["email", "phone", "letter", "text"]
export const alternateContactTypeRadioOrder = [
  "familyMember",
  "friend",
  "caseManager",
  "other",
  "dontHave",
]

export const preferredUnitCheckboxesOrder = [
  "Studio",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "3+ Bedroom",
]

export const howDidYouHearCheckboxesOrder = [
  "jurisdictionWebsite",
  "developerWebsite",
  "flyer",
  "emailAlert",
  "friend",
  "housingCounselor",
  "radioAd",
  "busAd",
  "other",
]

export const raceCheckboxesOrder = [
  "americanIndianAlaskanNative",
  "asian",
  "asian-asianIndian",
  "asian-chinese",
  "asian-filipino",
  "asian-korean",
  "asian-vietnamese",
  "asian-otherAsian",
  "blackAfricanAmerican",
  "nativeHawaiianOtherPacificIslander",
  "nativeHawaiianOtherPacificIslander-nativeHawaiian",
  "nativeHawaiianOtherPacificIslander-guamanianOrChamorro",
  "nativeHawaiianOtherPacificIslander-samoan",
  "white",
  "otherMultiracial",
  "declineToRespond",
]

export const ElmVillageApplication: Application = {
  markedAsDuplicate: false,
  ...idDefaults,
  listings: {
    id: "abcd1234",
  },
  applicant: {
    ...idDefaults,
    phoneNumber: "(444) 444-4444",
    noPhone: false,
    phoneNumberType: "work",
    workInRegion: YesNoEnum.yes,
    applicantAddress: {
      ...idDefaults,
      street: "600 Montgomery St",
      street2: "Unit",
      city: "San Francisco",
      state: "CA",
      zipCode: "94111",
      county: "",
      latitude: null,
      longitude: null,
    },
    applicantWorkAddress: {
      ...idDefaults,
      street: "Work Street",
      street2: "Work Unit",
      city: "Work City",
      state: "AL",
      zipCode: "90221",
      county: "",
      latitude: null,
      longitude: null,
    },
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    birthMonth: "7",
    birthDay: "17",
    birthYear: "1996",
    emailAddress: "test@bloom.com",
    noEmail: false,
  },
  additionalPhone: true,
  additionalPhoneNumber: "(555) 555-5555",
  additionalPhoneNumberType: "home",
  contactPreferences: ["email"],
  householdSize: 2,
  housingStatus: "",
  sendMailToMailingAddress: true,
  householdExpectingChanges: true,
  householdStudent: true,
  applicationsMailingAddress: {
    ...idDefaults,
    street: "Mailing Street",
    street2: "Mailing Unit",
    city: "Mailing City",
    state: "AK",
    zipCode: "90220",
  },
  applicationsAlternateAddress: {
    ...idDefaults,
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  alternateContact: {
    ...idDefaults,
    type: AlternateContactRelationship.other,
    firstName: "Alternate Name",
    lastName: "Alternate Last Name",
    agency: "Agency Name",
    phoneNumber: "(333) 333-3333",
    otherType: "Other Relationship",
    emailAddress: "test2@bloom.com",
    address: {
      ...idDefaults,
      street: "Contact Street",
      street2: "Contact Street 2",
      city: "Contact City",
      state: "AK",
      zipCode: "90222",
    },
  },
  accessibility: {
    ...idDefaults,
    mobility: true,
    vision: true,
    hearing: true,
  },
  incomeVouchers: true,
  income: "3000.00",
  incomePeriod: IncomePeriodEnum.perMonth,
  householdMember: [
    {
      ...idDefaults,
      firstName: "Member Name",
      middleName: "Member Middle Name",
      lastName: "Member Last Name",
      birthMonth: "7",
      birthDay: "17",
      birthYear: "1996",
      householdMemberAddress: {
        ...idDefaults,
        street: "Member Street",
        street2: "Member Unit",
        city: "Member City",
        state: "AZ",
        zipCode: "90223",
      },
      householdMemberWorkAddress: {
        ...idDefaults,
        street: "Member Work Street",
        street2: "Member Work Unit",
        city: "Member Work City",
        state: "AR",
        zipCode: "90224",
      },
      sameAddress: YesNoEnum.no,
      relationship: HouseholdMemberRelationship.spouse,
      workInRegion: YesNoEnum.yes,
    },
  ],
  preferredUnitTypes: [
    {
      ...idDefaults,
      id: "dff3ff70-7085-4dab-afd9-de4b33e0ec1e",
      name: "1 Bedroom" as UnitTypeEnum,
      numBedrooms: 1,
    },
  ],
  demographics: {
    ...idDefaults,
    race: ["americanIndianAlaskanNative"],
    ethnicity: "hispanicLatino",
    gender: "",
    sexualOrientation: "",
    howDidYouHear: ["jurisdictionWebsite", "developerWebsite"],
  },
  preferences: [
    {
      key: "Work in the city",
      claimed: true,
      options: [
        {
          key: "live",
          checked: true,
          extraData: [],
          address: {
            street: "1600 pennsylvania ave",
            city: "Washington",
            state: "DC",
            zipCode: "20500",
          },
          addressHolder: {
            name: "First Last",
            relationship: "Friend",
          },
        },
        {
          key: "work",
          checked: true,
          extraData: [],
          address: {
            street: "1600 pennsylvania ave",
            city: "Washington",
            state: "DC",
            zipCode: "20500",
          },
        },
      ],
    },
    {
      key: "cityEmployee",
      claimed: false,
      options: [
        {
          key: "cityEmployee",
          checked: false,
          extraData: [],
        },
      ],
    },
  ] as ApplicationMultiselectQuestion[],
  programs: [
    {
      claimed: true,
      key: "Veteran",
      options: [
        {
          key: "servedInMilitary",
          checked: true,
        },
        {
          key: "doNotConsider",
          checked: false,
        },
        {
          key: "preferNotToSay",
          checked: false,
        },
      ],
    },
  ] as ApplicationMultiselectQuestion[],
  confirmationCode: "",
  status: ApplicationStatusEnum.draft,
  submissionType: ApplicationSubmissionTypeEnum.electronical,
  language: LanguagesEnum.en,
}

const BlueSkyProgramsAndPreferences = {
  preferences: [],
  programs: [
    {
      claimed: false,
      key: "servedInMilitary",
      options: [
        {
          key: "servedInMilitary",
          checked: false,
        },
        {
          key: "doNotConsider",
          checked: false,
        },
        {
          key: "preferNotToSay",
          checked: false,
        },
      ],
    },
    {
      key: "tay",
      claimed: false,
      options: [
        {
          key: "tay",
          checked: false,
        },
        {
          key: "doNotConsider",
          checked: false,
        },
        {
          key: "preferNotToSay",
          checked: false,
        },
      ],
    },
    {
      key: "disabilityOrMentalIllness",
      claimed: false,
      options: [
        {
          key: "disabilityOrMentalIllness",
          checked: false,
        },
        {
          key: "doNotConsider",
          checked: false,
        },
        {
          key: "preferNotToSay",
          checked: false,
        },
      ],
    },
    {
      key: "housingSituation",
      claimed: false,
      options: [
        {
          key: "notPermanent",
          checked: false,
        },
        {
          key: "homeless",
          checked: false,
        },
        {
          key: "doNotConsider",
          checked: false,
        },
        {
          key: "preferNotToSay",
          checked: false,
        },
      ],
    },
    {
      key: "rentBasedOnIncome",
      claimed: false,
      options: [
        {
          key: "flatRent",
          checked: false,
        },
        {
          key: "30Percent",
          checked: false,
        },
      ],
    },
  ] as ApplicationMultiselectQuestion[],
}

export const autofillBlueSkyApplication: Application = {
  ...ElmVillageApplication,
  ...BlueSkyProgramsAndPreferences,
}

export const minimalDataApplication: Application = {
  markedAsDuplicate: false,
  ...idDefaults,
  listings: {
    id: "abcd1234",
  },
  applicant: {
    ...idDefaults,
    phoneNumber: null,
    noPhone: true,
    phoneNumberType: null,
    workInRegion: YesNoEnum.no,
    applicantAddress: {
      ...idDefaults,
      street: "600 Montgomery St",
      street2: "Unit",
      city: "San Francisco",
      state: "CA",
      zipCode: "94111",
      county: "",
    },
    applicantWorkAddress: {
      ...idDefaults,
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    firstName: "First Name",
    middleName: null,
    lastName: "Last Name",
    birthMonth: "07",
    birthDay: "17",
    birthYear: "1996",
    emailAddress: null,
    noEmail: true,
  },
  additionalPhone: false,
  additionalPhoneNumber: "",
  additionalPhoneNumberType: "",
  contactPreferences: ["letter"],
  householdSize: 1,
  housingStatus: "",
  sendMailToMailingAddress: false,
  householdExpectingChanges: false,
  householdStudent: false,
  applicationsMailingAddress: {
    ...idDefaults,
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  applicationsAlternateAddress: {
    ...idDefaults,
    street: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
  },
  alternateContact: {
    ...idDefaults,
    type: AlternateContactRelationship.noContact,
    firstName: "",
    lastName: "",
    agency: "",
    phoneNumber: "",
    otherType: "",
    emailAddress: "",
    address: {
      ...idDefaults,
      street: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  },
  accessibility: {
    ...idDefaults,
    mobility: false,
    vision: false,
    hearing: false,
  },
  incomeVouchers: false,
  income: "50000",
  incomePeriod: IncomePeriodEnum.perYear,
  householdMember: [],
  preferredUnitTypes: [
    {
      ...idDefaults,
      id: "dff3ff70-7085-4dab-afd9-de4b33e0ec1e",
      name: "1 Bedroom" as UnitTypeEnum,
      numBedrooms: 1,
    },
  ],
  demographics: {
    ...idDefaults,
    howDidYouHear: [],
    race: [],
  },
  ...BlueSkyProgramsAndPreferences,
  confirmationCode: "",
  status: ApplicationStatusEnum.draft,
  submissionType: ApplicationSubmissionTypeEnum.electronical,
  language: LanguagesEnum.en,
}

export const applicationStepOrder = [
  { name: "chooseLanguage", route: "/applications/start/choose-language" },
  { name: "whatToExpect", route: "/applications/start/what-to-expect" },
  { name: "primaryApplicantName", route: "/applications/contact/name" },
  { name: "primaryApplicantAddress", route: "/applications/contact/address" },
  { name: "alternateContactType", route: "/applications/contact/alternate-contact-type" },
  { name: "alternateContactName", route: "/applications/contact/alternate-contact-name" },
  { name: "alternateContactInfo", route: "/applications/contact/alternate-contact-contact" },
  { name: "liveAlone", route: "/applications/household/live-alone" },
  { name: "householdMemberInfo", route: "/applications/household/members-info" },
  { name: "addMembers", route: "/applications/household/add-members" },
  { name: "preferredUnitSize", route: "/applications/household/preferred-units" },
  { name: "adaHouseholdMembers", route: "/applications/household/ada" },
  { name: "householdExpectingChanges", route: "/applications/household/changes" },
  { name: "householdStudent", route: "/applications/household/student" },
  { name: "programs", route: "/applications/programs/programs" },
  { name: "vouchersSubsidies", route: "/applications/financial/vouchers" },
  { name: "income", route: "/applications/financial/income" },
  { name: "preferencesAll", route: "/applications/preferences/all" },
  { name: "generalPool", route: "/applications/preferences/general" },
  { name: "demographics", route: "/applications/review/demographics" },
  { name: "summary", route: "/applications/review/summary" },
  { name: "terms", route: "/applications/review/terms" },
]
