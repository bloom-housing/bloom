import { t, formatYesNoLabel } from "@bloom-housing/ui-components"
import { IncomePeriod, ApplicationSubmissionType } from "@bloom-housing/backend-core/types"
import { convertDataToPst, formatIncome } from "../../lib/helpers"
import moment from "moment"

function compareDates(a, b, node, nextNode, isInverted) {
  const dateStringFormat = "MM/DD/YYYY at hh:mm:ss A"

  const dateA = moment(a, dateStringFormat)
  const dateB = moment(b, dateStringFormat)

  if (a && b && dateA.isSame(dateB)) {
    return 0
  } else if (a === "") {
    return isInverted ? -1 : 1
  } else if (b === "") {
    return isInverted ? 1 : -1
  } else {
    return dateA.unix() - dateB.unix()
  }
}

function compareStrings(a, b, node, nextNode, isInverted) {
  if (a === b) {
    return 0
  } else if (a === null) {
    return isInverted ? -1 : 1
  } else if (b === null) {
    return isInverted ? 1 : -1
  } else {
    return a.localeCompare(b)
  }
}

export function getColDefs(maxHouseholdSize: number, countyCode: string) {
  const defs = [
    {
      headerName: t("application.details.submittedDate"),
      field: "submissionDate",
      sortable: true,
      unSortIcon: true,
      filter: false,
      pinned: "left",
      width: 200,
      minWidth: 150,
      sort: "asc",
      valueGetter: ({ data }) => {
        if (!data?.submissionDate) return ""

        const { submissionDate } = data

        const dateTime = convertDataToPst(
          submissionDate,
          data?.submissionType || ApplicationSubmissionType.electronical
        )

        return `${dateTime.date} ${t("t.at")} ${dateTime.time}`
      },
      comparator: compareDates,
    },
    {
      headerName: t("application.details.number"),
      field: "confirmationCode",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
      pinned: "left",
      cellRenderer: "formatLinkCell",
    },
    {
      headerName: t("applications.table.applicationType"),
      field: "submissionType",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 150,
      minWidth: 120,
      pinned: "left",
      valueFormatter: ({ value }) => t(`application.details.submissionType.${value}`),
      comparator: compareStrings,
    },
    {
      headerName: t("application.name.firstName"),
      field: "applicant.firstName",
      colId: "firstName",
      sortable: true,
      unSortIcon: true,
      filter: false,
      pinned: "left",
      width: 125,
      minWidth: 100,
      comparator: compareStrings,
    },
    {
      headerName: t("application.name.lastName"),
      field: "applicant.lastName",
      colId: "lastName",
      sortable: true,
      unSortIcon: true,
      filter: "agTextColumnFilter",
      pinned: "left",
      width: 125,
      minWidth: 100,
      comparator: compareStrings,
    },
    {
      headerName: t("application.details.householdSize"),
      field: "householdSize",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 140,
      minWidth: 140,
      type: "rightAligned",
    },
    {
      headerName: t("applications.table.declaredAnnualIncome"),
      field: "income",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 180,
      minWidth: 150,
      type: "rightAligned",
      valueGetter: (row) => {
        if (!row?.data?.income || !row?.data?.incomePeriod) return ""

        const { income, incomePeriod } = row.data

        return incomePeriod === IncomePeriod.perYear
          ? formatIncome(income, incomePeriod, IncomePeriod.perYear)
          : ""
      },
      comparator: compareStrings,
    },
    {
      headerName: t("applications.table.declaredMonthlyIncome"),
      field: "income",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 180,
      minWidth: 150,
      type: "rightAligned",
      valueGetter: (row) => {
        if (!row?.data?.income || !row?.data?.incomePeriod) return ""

        const { income, incomePeriod } = row.data

        return incomePeriod === IncomePeriod.perMonth
          ? formatIncome(income, incomePeriod, IncomePeriod.perMonth)
          : ""
      },
      comparator: compareStrings,
    },
    {
      headerName: t("applications.table.subsidyOrVoucher"),
      field: "incomeVouchers",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 120,
      minWidth: 100,
      valueFormatter: (data) => {
        if (!data.value) return ""

        return data.value ? t("t.yes") : t("t.no")
      },
      comparator: compareStrings,
    },
    {
      headerName: t("applications.table.requestAda"),
      field: "accessibility",
      sortable: false,
      unSortIcon: true,
      filter: true,
      width: 120,
      minWidth: 100,
      valueGetter: (row) => {
        if (!row?.data?.accessibility) return ""

        const { accessibility } = row.data

        const posiviveValues = Object.entries(accessibility).reduce((acc, curr) => {
          if (curr[1] && !["id", "createdAt", "updatedAt"].includes(curr[0])) {
            acc.push(t(`application.ada.${curr[0]}`))
          }

          return acc
        }, [])

        return posiviveValues.length ? posiviveValues.join(", ") : t("t.none")
      },
    },
    {
      headerName: t("applications.table.preferenceClaimed"),
      field: "preferences",
      sortable: false,
      unSortIcon: true,
      filter: true,
      width: 150,
      minWidth: 100,
      valueGetter: (row) => {
        if (!row?.data?.preferences) return ""

        const { preferences } = row.data

        const claimed = preferences.reduce((acc, curr) => {
          if (curr.claimed) {
            acc.push(t(`application.preferences.${curr.key}.title`, { county: countyCode }))
          }

          return acc
        }, [])

        return claimed?.length ? claimed.join(", ") : t("t.none")
      },
    },
    {
      headerName: t("applications.table.primaryDob"),
      field: "applicant",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (!value) return ""

        const isValidDOB = !!value?.birthMonth && !!value?.birthDay && value?.birthYear

        return isValidDOB ? `${value.birthMonth}/${value.birthDay}/${value.birthYear}` : ""
      },
    },
    {
      headerName: t("t.email"),
      field: "applicant.emailAddress",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("t.phone"),
      field: "applicant.phoneNumber",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.phoneType"),
      field: "applicant.phoneNumberType",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return t(`application.contact.phoneNumberTypes.${value}`)
      },
    },
    {
      headerName: t("t.additionalPhone"),
      field: "additionalPhoneNumber",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return value ? value : t("t.none")
      },
    },
    {
      headerName: t("applications.table.additionalPhoneType"),
      field: "additionalPhoneNumberType",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return value ? t(`application.contact.phoneNumberTypes.${value}`) : t("t.none")
      },
    },
    {
      headerName: t("applications.table.residenceStreet"),
      field: "applicant.address.street",
      sortable: false,
      filter: false,
      width: 175,
      minWidth: 150,
    },
    {
      headerName: t("applications.table.residenceCity"),
      field: "applicant.address.city",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
    },
    {
      headerName: t("applications.table.residenceState"),
      field: "applicant.address.state",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.residenceZip"),
      field: "applicant.address.zipCode",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.mailingStreet"),
      field: "mailingAddress.street",
      sortable: false,
      filter: false,
      width: 175,
      minWidth: 150,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""
        return `${data.sendMailToMailingAddress ? value : data.applicant.address.street}`
      },
    },
    {
      headerName: t("applications.table.mailingCity"),
      field: "mailingAddress.city",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.address.city}`
      },
    },
    {
      headerName: t("applications.table.mailingState"),
      field: "mailingAddress.state",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.address.state}`
      },
    },
    {
      headerName: t("applications.table.mailingZip"),
      field: "mailingAddress.zipCode",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.address.zipCode}`
      },
    },
    {
      headerName: t("applications.table.workStreet"),
      field: "applicant.workAddress.street",
      sortable: false,
      filter: false,
      width: 175,
      minWidth: 150,
    },
    {
      headerName: t("applications.table.workCity"),
      field: "applicant.workAddress.city",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 120,
    },
    {
      headerName: t("applications.table.workState"),
      field: "applicant.workAddress.state",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.workZip"),
      field: "applicant.workAddress.zipCode",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactFirstName"),
      field: "alternateContact.firstName",
      sortable: false,
      filter: false,
      width: 125,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactLastName"),
      field: "alternateContact.lastName",
      sortable: false,
      filter: false,
      width: 125,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactRelationship"),
      field: "alternateContact.type",
      sortable: false,
      filter: false,
      width: 132,
      minWidth: 132,
      valueFormatter: ({ data, value }) => {
        if (!value) return ""

        return value == "other"
          ? data.alternateContact.otherType
          : t(`application.alternateContact.type.options.${value}`)
      },
    },
    {
      headerName: t("applications.table.altContactAgency"),
      field: "alternateContact.agency",
      sortable: false,
      filter: false,
      width: 125,
      minWidth: 100,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return value?.length ? value : t("t.none")
      },
    },
    {
      headerName: t("applications.table.altContactEmail"),
      field: "alternateContact.emailAddress",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactPhone"),
      field: "alternateContact.phoneNumber",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },

    {
      headerName: t("applications.table.altContactStreetAddress"),
      field: "alternateContact.mailingAddress.street",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactCity"),
      field: "alternateContact.mailingAddress.city",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactState"),
      field: "alternateContact.mailingAddress.state",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
    {
      headerName: t("applications.table.altContactZip"),
      field: "alternateContact.mailingAddress.zipCode",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 100,
    },
  ]

  const householdCols = []

  for (let i = 0; i < maxHouseholdSize; i++) {
    const householdIndex = i + 1

    householdCols.push(
      {
        headerName: `${t("application.name.firstName")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          return value[i]?.firstName ? value[i].firstName : ""
        },
      },
      {
        headerName: `${t("application.name.lastName")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          return value[i]?.lastName ? value[i].lastName : ""
        },
      },
      {
        headerName: `${t("applications.table.householdDob")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          const isValidDOB = !!value[i]?.birthMonth && !!value[i]?.birthDay && value[i]?.birthYear

          return isValidDOB
            ? `${value[i].birthMonth}/${value[i].birthDay}/${value[i].birthYear}`
            : ""
        },
      },
      {
        headerName: `${t("t.relationship")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 132,
        minWidth: 132,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          return value[i]?.relationship
            ? t(`application.form.options.relationship.${value[i].relationship}`)
            : ""
        },
      },
      {
        headerName: `${t("application.add.sameAddressAsPrimary")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          if (!value) return ""
          return formatYesNoLabel(value[i]?.sameAddress)
        },
      },
      {
        headerName: `${t("application.details.workInRegion")} HH:${householdIndex}`,
        field: "householdMembers",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          if (!value) return ""
          return formatYesNoLabel(value[i]?.workInRegion)
        },
      }
    )
  }

  return [...defs, ...householdCols]
}
