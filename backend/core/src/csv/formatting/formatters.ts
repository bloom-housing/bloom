import { Application } from "../../applications/entities/application.entity"
import { HouseholdMember } from "../../applications/entities/household-member.entity"
import { ApplicationPreference } from "../../applications/entities/application-preferences.entity"
import { TextInput } from "../../applications/types/form-metadata/text-input"
import { AddressInput } from "../../applications/types/form-metadata/address-input"

export const defaultFormatter = (obj?) => (obj ? obj.toString() : "")
export const booleanFormatter = (obj?: boolean) => (obj ? "Yes" : "No")
export const streetFormatter = (obj?: { street?: string; street2?: string }) => {
  if (!obj) {
    return defaultFormatter(obj)
  }
  if (!obj.street && !obj.street2) {
    return ""
  }
  if (!obj.street) {
    return obj.street2
  }
  if (!obj.street2) {
    return obj.street
  }
  return `${obj.street}, ${obj.street2}`
}
export const dobFormatter = (obj?: {
  birthMonth?: string
  birthDay?: string
  birthYear?: string
}) => {
  // TODO Use locale variable Date string
  return obj ? `${obj.birthMonth}/${obj.birthDay}/${obj.birthYear}` : defaultFormatter(obj)
}
export const joinArrayFormatter = (obj?: string[]) => (obj ? obj.join(",") : "")
export const keysToJoinedStringFormatter = (obj: unknown) => {
  if (!obj) {
    return defaultFormatter(obj)
  }
  const keys = Object.keys(obj).filter((key) => obj[key])
  return keys.join(",")
}

export const formatApplicationNumber = {
  label: "Application Number",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.id)
  },
}
export const formatApplicatonSubmissionDate = {
  label: "Application Submission Date",
  discriminator: "",
  formatter: (application: Application) =>
    new Date(application.createdAt).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    }),
}
export const formatPrimaryApplicantFirstName = {
  label: "Primary Applicant First Name",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.firstName)
  },
}
export const formatPrimaryApplicantMiddleName = {
  label: "Primary Applicant Middle Name",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.middleName)
  },
}
export const formatPrimaryApplicantLastName = {
  label: "Primary Applicant Last Name",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.lastName)
  },
}
export const formatPrimaryApplicantDOB = {
  label: "Primary Applicant Date of Birth",
  discriminator: "",
  formatter: (application: Application) => {
    return dobFormatter(application.applicant)
  },
}
export const formatPrimaryApplicantEmail = {
  label: "Primary Applicant Email",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.emailAddress)
  },
}
export const formatPrimaryApplicantPhone = {
  label: "Primary Applicant Phone",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.phoneNumber)
  },
}
export const formatPrimaryApplicantPhoneType = {
  label: "Primary Applicant Phone Type",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.phoneNumberType)
  },
}
export const formatPrimaryApplicantAdditionalPhone = {
  label: "Primary Applicant Additional Phone",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.additionalPhoneNumber)
  },
}
export const formatPrimaryApplicantAdditionalPhoneType = {
  label: "Primary Applicant Additional Phone Type",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.additionalPhoneNumberType)
  },
}
export const formatPrimaryApplicantPreferredContactType = {
  label: "Primary Applicant Preferred Contact Type",
  discriminator: "",
  formatter: (application: Application) => {
    return joinArrayFormatter(application.contactPreferences)
  },
}
export const formatPrimaryApplicantResidenceAddress = {
  label: "Primary Applicant Residence Street Address",
  discriminator: "",
  formatter: (application: Application) => {
    return streetFormatter(application.applicant.address)
  },
}
export const formatPrimaryApplicantResidenceCity = {
  label: "Primary Applicant Residence City",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.address.city)
  },
}
export const formatPrimaryApplicantResidenceState = {
  label: "Primary Applicant Residence State",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.address.state)
  },
}
export const formatPrimaryApplicantResidenceZip = {
  label: "Primary Applicant Residence Zip",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.address.zipCode)
  },
}

export const formatPrimaryApplicantMailingStreetAddress = {
  label: "Primary Applicant Mailing Street Address",
  discriminator: "",
  formatter: (application: Application) => {
    return streetFormatter(application.mailingAddress)
  },
}
export const formatPrimaryApplicantMailingCity = {
  label: "Primary Applicant Mailing City",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.mailingAddress.city)
  },
}
export const formatPrimaryApplicantMailingState = {
  label: "Primary Applicant Mailing State",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.mailingAddress.state)
  },
}
export const formatPrimaryApplicantMailingZip = {
  label: "Primary Applicant Mailing Zip",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.mailingAddress.zipCode)
  },
}
export const formatPrimaryApplicantWorkStreetAddress = {
  label: "Primary Applicant Work Street Address",
  discriminator: "",
  formatter: (application: Application) => {
    return streetFormatter(application.applicant.workAddress)
  },
}
export const formatPrimaryApplicantWorkCity = {
  label: "Primary Applicant Work City",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.workAddress.city)
  },
}
export const formatPrimaryApplicantWorkState = {
  label: "Primary Applicant Work State",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.workAddress.state)
  },
}
export const formatPrimaryApplicantWorkZip = {
  label: "Primary Applicant Work Zip",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.applicant.workAddress.zipCode)
  },
}
export const formatAlternateContactFirstName = {
  label: "Alternate Contact First Name",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.firstName)
  },
}
export const formatAlternateContactLastName = {
  label: "Alternate Contact Last Name",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.lastName)
  },
}
export const formatAlternateContactType = {
  label: "Alternate Contact Type",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.type)
  },
}
export const formatAlternateContactAgency = {
  label: "Alternate Contact Agency",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.agency)
  },
}
export const formatAlternateContactOther = {
  label: "Alternate Contact Other",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.otherType)
  },
}
export const formatAlternateContactEmail = {
  label: "Alternate Contact Email",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.emailAddress)
  },
}
export const formatAlternateContactPhone = {
  label: "Alternate Contact Phone",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.phoneNumber)
  },
}
export const formatAlternateContactStreetAddress = {
  label: "Alternate Contact Street Address",
  discriminator: "",
  formatter: (application: Application) => {
    return streetFormatter(application.alternateContact.mailingAddress)
  },
}
export const formatAlternateContactCity = {
  label: "Alternate Contact City",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.mailingAddress.city)
  },
}
export const formatAlternateContactState = {
  label: "Alternate Contact State",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.mailingAddress.state)
  },
}
export const formatAlternateContactZip = {
  label: "Alternate Contact Zip",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.alternateContact.mailingAddress.zipCode)
  },
}
export const formatMonthlyIncome = {
  label: "Monthly Income",
  discriminator: "",
  formatter: (application: Application) => {
    switch (application.incomePeriod) {
      case "perYear":
        return ""
      case "perMonth":
        return application.income
      default:
        return ""
    }
  },
}
export const formatAnnualIncome = {
  label: "Annual Income",
  discriminator: "",
  formatter: (application: Application) => {
    switch (application.incomePeriod) {
      case "perYear":
        return application.income
      case "perMonth":
        return ""
      default:
        return ""
    }
  },
}
export const formatAccessibility = {
  label: "Requested accessibility",
  discriminator: "",
  formatter: (application: Application) => {
    return keysToJoinedStringFormatter({
      hearing: application.accessibility.hearing,
      mobility: application.accessibility.mobility,
      vision: application.accessibility.vision,
    })
  },
}
export const formatVouchersOrSubsidies = {
  label: "Receives Vouchers or Subsidies",
  discriminator: "",
  formatter: (application: Application) => {
    return booleanFormatter(application.incomeVouchers)
  },
}
export const formatRequestUnitType = {
  label: "Requested unit type",
  discriminator: "",
  formatter: (application: Application) => {
    return joinArrayFormatter(application.preferredUnit.map((unit) => unit.name))
  },
}
export const formatHouseholdSize = {
  label: "Household Size",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.householdSize)
  },
}
export const formatHoueholdMembers = {
  type: "array",
  size: null,
  discriminator: "householdMembers",
  items: [
    {
      label: "Household First Name",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.firstName)
      },
    },
    {
      label: "Household Middle Name",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.middleName)
      },
    },
    {
      label: "Household Last Name",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.lastName)
      },
    },
    {
      label: "Household Relationship",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.relationship)
      },
    },
    {
      label: "Household Date of Birth",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return dobFormatter(householdMember)
      },
    },
    {
      label: "Household Residence Street Address",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return streetFormatter(householdMember.address)
      },
    },
    {
      label: "Household Residence City",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.address.city)
      },
    },
    {
      label: "Household Residence State",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.address.state)
      },
    },
    {
      label: "Household Residence Zip",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.address.zipCode)
      },
    },
    {
      label: "Household Work Street Address",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return streetFormatter(householdMember.workAddress)
      },
    },
    {
      label: "Household Work City",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.workAddress.city)
      },
    },
    {
      label: "Household Work State",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.workAddress.state)
      },
    },
    {
      label: "Household Work Zip",
      discriminator: "",
      formatter: (householdMember: HouseholdMember) => {
        return defaultFormatter(householdMember.workAddress.zipCode)
      },
    },
  ],
}
const preferenceClaimedFormatter = (
  preferenceKey: string,
  option: string,
  application: Application
) => {
  const liveOrWorkPreferences = application.preferences.filter(
    (pref) => pref.key === preferenceKey && pref.claimed
  )
  if (liveOrWorkPreferences.length !== 1) {
    return ""
  }
  const liveOrWorkPreference: ApplicationPreference = liveOrWorkPreferences[0]
  return liveOrWorkPreference.options.filter((pref) => pref.checked && pref.key === option).length
    ? "claimed"
    : ""
}

export const formatLivePreference = {
  label: "Live preference",
  discriminator: "",
  formatter: preferenceClaimedFormatter.bind(this, "liveWork", "live"),
}
export const formatWorkPreference = {
  label: "Work preference",
  discriminator: "",
  formatter: preferenceClaimedFormatter.bind(this, "liveWork", "work"),
}

const displacedTenantFormatter = (optionKey: string, application: Application) => {
  const displacedTenantPreferences = application.preferences.filter(
    (pref) => pref.key === "displacedTenant" && pref.claimed
  )
  if (displacedTenantPreferences.length !== 1) {
    return ""
  }
  const displacedTenantSubPreference = displacedTenantPreferences[0].options.filter(
    (pref) => pref.checked && pref.key === optionKey
  )
  if (!displacedTenantSubPreference.length) {
    return ""
  }
  const nameExtraDataFilter = displacedTenantSubPreference[0].extraData.filter(
    (val) => val.key === "name"
  )
  const addressExtraDataFilter = displacedTenantSubPreference[0].extraData.filter(
    (val) => val.key === "address"
  )
  if (!nameExtraDataFilter.length || !addressExtraDataFilter.length) {
    return ""
  }
  const nameExtraData = nameExtraDataFilter[0] as TextInput
  const addressExtraData = addressExtraDataFilter[0] as AddressInput

  return `Name: ${nameExtraData.value} Street: ${addressExtraData.value.street || ""}, Street2: ${
    addressExtraData.value.street2 || ""
  }, Zip Code: ${addressExtraData.value.zipCode || ""}, City: ${
    addressExtraData.value.city || ""
  }, County: ${addressExtraData.value.county || ""}, State: ${addressExtraData.value.state || ""}`
}

export const formatDisplacedTenantPreferenceGeneralClaimed = {
  label: "Displaced tenant preference (general)",
  discriminator: "",
  formatter: preferenceClaimedFormatter.bind(this, "displacedTenant", "general"),
}

export const formatDisplacedTenantPreferenceGeneralData = {
  label: "Displaced tenant preference (general) name and address",
  discriminator: "",
  formatter: displacedTenantFormatter.bind(this, "general"),
}

export const formatDisplacedTenantPreferenceMissionCorridorClaimed = {
  label: "Displaced tenant preference (mission corridor)",
  discriminator: "",
  formatter: preferenceClaimedFormatter.bind(this, "displacedTenant", "missionCorridor"),
}

export const formatDisplacedTenantPreferenceMissionCorridorData = {
  label: "Displaced tenant preference (mission corridor) name and address",
  discriminator: "",
  formatter: displacedTenantFormatter.bind(this, "missionCorridor"),
}

export const formatApplicationType = {
  label: "Application Type",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.submissionType)
  },
}

export const formatDemographicsEthnicity = {
  label: "Demographics Ethnicity",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.demographics.ethnicity)
  },
}

export const formatDemographicsRace = {
  label: "Demographics Race",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.demographics.race)
  },
}

export const formatDemographicsGender = {
  label: "Demographics Gender",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.demographics.gender)
  },
}

export const formatDemographicsSexualOrientation = {
  label: "Demographics Sexual Orientation",
  discriminator: "",
  formatter: (application: Application) => {
    return defaultFormatter(application.demographics.sexualOrientation)
  },
}

export const formatDemographicsHowDidYouHear = {
  label: "Demographics How Did You Hear About Us",
  discriminator: "",
  formatter: (application: Application) => {
    return joinArrayFormatter(application.demographics.howDidYouHear)
  },
}

export const formatOHAPreference = {
  label: "Oakland Housing Authority Project Based Vouchers",
  discriminator: "",
  formatter: (application: Application) => {
    const pbvPreferences = application.preferences.filter((pref) => pref.key === "PBV")
    if (pbvPreferences.length !== 1) {
      return ""
    }
    return (
      pbvPreferences[0].options
        .filter((option) => option.checked)
        .map((option) => option.key)
        .join(",") || ""
    )
  },
}

export const formatHOPWAPreference = {
  label: "Housing Opportunities for Persons with AIDS",
  discriminator: "",
  formatter: (application: Application) => {
    const hopwaPreferences = application.preferences.filter((pref) => pref.key === "HOPWA")
    if (hopwaPreferences.length !== 1) {
      return ""
    }
    return (
      hopwaPreferences[0].options
        .filter((option) => option.checked)
        .map((option) => option.key)
        .join(",") || ""
    )
  },
}

export const formatBHAPreference = {
  label: "Berkeley Housing Authority",
  discriminator: "",
  formatter: (application: Application) => {
    const bhaPreferences = application.preferences.filter((pref) => pref.key === "BHA")
    if (bhaPreferences.length !== 1) {
      return ""
    }
    return bhaPreferences[0].options
      .filter((option) => option.checked)
      .map((option) => option.key)[0] === "bha"
      ? "claimed"
      : "do not consider"
  },
}

export const formatMarkedAsDuplicate = {
  label: "Marked as duplicate",
  discriminator: "",
  formatter: (application: Application) => {
    return booleanFormatter(application.markedAsDuplicate)
  },
}

export const formatFlagged = {
  label: "Flagged",
  discriminator: "",
  formatter: (application: Application) => {
    return booleanFormatter(application.flagged)
  },
}
