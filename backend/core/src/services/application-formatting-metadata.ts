import {
  booleanFormatter,
  defaultFormatter,
  dobFormatter,
  FormattingMetadataAggregateFactory,
  joinArrayFormatter,
  keysToJoinedStringFormatter,
  streetFormatter,
} from "./csv-builder.service"
import { Application } from "../applications/entities/application.entity"
import { HouseholdMember } from "../applications/entities/household-member.entity"

export const applicationFormattingMetadataAggregateFactory: FormattingMetadataAggregateFactory = () => {
  return [
    {
      label: "Application Number",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.id)
      },
    },
    {
      label: "Application Submission Date",
      discriminator: "",
      formatter: (application: Application) =>
        new Date(application.createdAt).toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        }),
    },
    {
      label: "Primary Applicant First Name",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.firstName)
      },
    },
    {
      label: "Primary Applicant Middle Name",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.middleName)
      },
    },
    {
      label: "Primary Applicant Last Name",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.lastName)
      },
    },
    {
      label: "Primary Applicant Date of Birth",
      discriminator: "",
      formatter: (application: Application) => {
        return dobFormatter(application.applicant)
      },
    },
    {
      label: "Primary Applicant Email",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.emailAddress)
      },
    },
    {
      label: "Primary Applicant Phone",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.phoneNumber)
      },
    },
    {
      label: "Primary Applicant Phone Type",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.phoneNumberType)
      },
    },
    {
      label: "Primary Applicant Additional Phone",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.additionalPhone)
      },
    },
    {
      label: "Primary Applicant Additional Phone Type",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.additionalPhoneNumberType)
      },
    },
    {
      label: "Primary Applicant Preferred Contact Type",
      discriminator: "",
      formatter: (application: Application) => {
        return joinArrayFormatter(application.contactPreferences)
      },
    },
    {
      label: "Primary Applicant Residence Street Address",
      discriminator: "",
      formatter: (application: Application) => {
        return streetFormatter(application.applicant.address)
      },
    },
    {
      label: "Primary Applicant Residence City",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.address.city)
      },
    },
    {
      label: "Primary Applicant Residence State",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.address.state)
      },
    },
    {
      label: "Primary Applicant Residence Zip",
      discriminator: "",
      formatter: (application: Application) => application.applicant.address.zipCode,
    },
    {
      label: "Primary Applicant Mailing Street Address",
      discriminator: "",
      formatter: (application: Application) => {
        return streetFormatter(application.mailingAddress)
      },
    },
    {
      label: "Primary Applicant Mailing City",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.mailingAddress.city)
      },
    },
    {
      label: "Primary Applicant Mailing State",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.mailingAddress.state)
      },
    },
    {
      label: "Primary Applicant Mailing Zip",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.mailingAddress.zipCode)
      },
    },
    {
      label: "Primary Applicant Work Street Address",
      discriminator: "",
      formatter: (application: Application) => {
        return streetFormatter(application.applicant.workAddress)
      },
    },
    {
      label: "Primary Applicant Work City",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.workAddress.city)
      },
    },
    {
      label: "Primary Applicant Work State",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.workAddress.state)
      },
    },
    {
      label: "Primary Applicant Work Zip",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.applicant.workAddress.zipCode)
      },
    },
    {
      label: "Alternate Contact First Name",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.firstName)
      },
    },
    {
      label: "Alternate Contact Last Name",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.lastName)
      },
    },
    {
      label: "Alternate Contact Type",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.type)
      },
    },
    {
      label: "Alternate Contact Agency",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.agency)
      },
    },
    {
      label: "Alternate Contact Other",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.otherType)
      },
    },
    {
      label: "Alternate Contact Email",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.emailAddress)
      },
    },
    {
      label: "Alternate Contact Phone",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.phoneNumber)
      },
    },
    {
      label: "Alternate Contact Street Address",
      discriminator: "",
      formatter: (application: Application) => {
        return streetFormatter(application.alternateContact.mailingAddress)
      },
    },
    {
      label: "Alternate Contact City",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.mailingAddress.city)
      },
    },
    {
      label: "Alternate Contact State",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.mailingAddress.state)
      },
    },
    {
      label: "Alternate Contact Zip",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.alternateContact.mailingAddress.zipCode)
      },
    },
    {
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
    },
    {
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
    },
    {
      label: "Requested accessibility",
      discriminator: "",
      formatter: (application: Application) => {
        return keysToJoinedStringFormatter({
          hearing: application.accessibility.hearing,
          mobility: application.accessibility.mobility,
          vision: application.accessibility.vision,
        })
      },
    },
    {
      label: "Receives Vouchers or Subsidies",
      discriminator: "",
      formatter: (application: Application) => {
        return booleanFormatter(application.incomeVouchers)
      },
    },
    {
      label: "Requested unit type",
      discriminator: "",
      formatter: (application: Application) => {
        return joinArrayFormatter(application.preferredUnit)
      },
    },
    {
      label: "Household Size",
      discriminator: "",
      formatter: (application: Application) => {
        return defaultFormatter(application.householdSize)
      },
    },
    {
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
    },
  ]
}
