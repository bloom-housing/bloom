import {
  booleanFormatter,
  defaultFormatter,
  dobFormatter,
  FormattingMetadataAggregateFactory,
  joinArrayFormatter,
  keysToJoinedStringFormatter,
  streetFormatter,
} from "./csv-builder.service"

export const applicationFormattingMetadataAggregateFactory: FormattingMetadataAggregateFactory = () => {
  return [
    { label: "Application Number", discriminator: "id", formatter: defaultFormatter },
    {
      label: "Application Submission Date",
      discriminator: "createdAt",
      formatter: (createdAt: string) =>
        new Date(createdAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    },
    {
      label: "Primary Applicant First Name",
      discriminator: "application.applicant.firstName",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Middle Name",
      discriminator: "application.applicant.middleName",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Last Name",
      discriminator: "application.applicant.lastName",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Date of Birth",
      discriminator: "application.applicant",
      formatter: dobFormatter,
    },
    {
      label: "Primary Applicant Email",
      discriminator: "application.applicant.emailAddress",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Phone",
      discriminator: "application.applicant.phoneNumber",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Phone Type",
      discriminator: "application.applicant.phoneNumberType",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Additional Phone",
      discriminator: "application.additionalPhoneNumber",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Additional Phone Type",
      discriminator: "application.additionalPhoneNumberType",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Preferred Contact Type",
      discriminator: "application.contactPreferences",
      formatter: joinArrayFormatter,
    },
    {
      label: "Primary Applicant Residence Street Address",
      discriminator: "application.applicant.address",
      formatter: streetFormatter,
    },
    {
      label: "Primary Applicant Residence City",
      discriminator: "application.applicant.address.city",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Residence State",
      discriminator: "application.applicant.address.state",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Residence Zip",
      discriminator: "application.applicant.address.zipCode",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Mailing Street Address",
      discriminator: "application.mailingAddress",
      formatter: streetFormatter,
    },
    {
      label: "Primary Applicant Mailing City",
      discriminator: "application.mailingAddress.city",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Mailing State",
      discriminator: "application.mailingAddress.state",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Mailing Zip",
      discriminator: "application.mailingAddress.zipCode",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Work Street Address",
      discriminator: "application.applicant.workAddress.street",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Work City",
      discriminator: "application.applicant.workAddress.city",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Work State",
      discriminator: "application.applicant.workAddress.state",
      formatter: defaultFormatter,
    },
    {
      label: "Primary Applicant Work Zip",
      discriminator: "application.applicant.workAddress.zipCode",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact First Name",
      discriminator: "application.alternateContact.firstName",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Last Name",
      discriminator: "application.alternateContact.lastName",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Type",
      discriminator: "application.alternateContact.type",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Agency",
      discriminator: "application.alternateContact.agency",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Other",
      discriminator: "application.alternateContact.otherType",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Email",
      discriminator: "application.alternateContact.emailAddress",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Phone",
      discriminator: "application.alternateContact.phoneNumber",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Street Address",
      discriminator: "application.alternateContact.mailingAddress.street",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact City",
      discriminator: "application.alternateContact.mailingAddress.city",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact State",
      discriminator: "application.alternateContact.mailingAddress.state",
      formatter: defaultFormatter,
    },
    {
      label: "Alternate Contact Zip",
      discriminator: "application.alternateContact.mailingAddress.zipCode",
      formatter: defaultFormatter,
    },
    {
      label: "Monthly Income",
      discriminator: "application",
      formatter: (application) => {
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
      discriminator: "application",
      formatter: (application) => {
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
      discriminator: "application.accessibility",
      formatter: keysToJoinedStringFormatter,
    },
    {
      label: "Receives Vouchers or Subsidies",
      discriminator: "application.incomeVouchers",
      formatter: booleanFormatter,
    },
    {
      label: "Requested unit type",
      discriminator: "application.preferredUnit",
      formatter: joinArrayFormatter,
    },
    {
      label: "Household Size",
      discriminator: "application.householdSize",
      formatter: defaultFormatter,
    },
    {
      type: "array",
      size: null,
      discriminator: "application.householdMembers",
      items: [
        { label: "Household First Name", discriminator: "firstName", formatter: defaultFormatter },
        {
          label: "Household Middle Name",
          discriminator: "middleName",
          formatter: defaultFormatter,
        },
        { label: "Household Last Name", discriminator: "lastName", formatter: defaultFormatter },
        {
          label: "Household Relationship",
          discriminator: "relationship",
          formatter: defaultFormatter,
        },
        { label: "Household Date of Birth", discriminator: ".", formatter: dobFormatter },
        {
          label: "Household Residence Street Address",
          discriminator: "address",
          formatter: streetFormatter,
        },
        {
          label: "Household Residence City",
          discriminator: "address.city",
          formatter: defaultFormatter,
        },
        {
          label: "Household Residence State",
          discriminator: "address.state",
          formatter: defaultFormatter,
        },
        {
          label: "Household Residence Zip",
          discriminator: "address.zipCode",
          formatter: defaultFormatter,
        },
        {
          label: "Household Work Street Address",
          discriminator: "workAddress.street",
          formatter: defaultFormatter,
        },
        {
          label: "Household Work City",
          discriminator: "workAddress.city",
          formatter: defaultFormatter,
        },
        {
          label: "Household Work State",
          discriminator: "workAddress.state",
          formatter: defaultFormatter,
        },
        {
          label: "Household Work Zip",
          discriminator: "workAddress.zipCode",
          formatter: defaultFormatter,
        },
      ],
    },
  ]
}
