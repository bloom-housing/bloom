import { ColDef } from "ag-grid-community"
import { t, formatYesNoLabel } from "@bloom-housing/ui-components"
import { convertDataToLocal, formatIncome } from "../../lib/helpers"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import {
  Application,
  IncomePeriodEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
dayjs.extend(customParseFormat)

function compareDates(a, b, node, nextNode, isInverted) {
  const dateStringFormat = "MM/DD/YYYY at hh:mm:ss A"

  const dateA = dayjs(a, dateStringFormat)
  const dateB = dayjs(b, dateStringFormat)

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

export function getColDefs(
  maxHouseholdSize: number,
  enableFullTimeStudentQuestion?: boolean
): ColDef[] {
  const defs: ColDef[] = [
    {
      headerName: t("application.details.submittedDate"),
      field: "submissionDate",
      sortable: true,
      unSortIcon: true,
      filter: false,
      width: 220,
      minWidth: 50,
      sort: "asc",
      valueGetter: ({ data }) => {
        if (!data?.submissionDate) return ""

        const { submissionDate } = data

        const dateTime = convertDataToLocal(submissionDate)

        return `${dateTime.date} ${t("t.at")} ${dateTime.time}`
      },
      comparator: compareDates,
    },
    {
      headerName: t("application.details.number"),
      field: "confirmationCode",
      sortable: false,
      filter: false,
      width: 140,
      minWidth: 50,
      cellRenderer: "formatLinkCell",
    },
    {
      headerName: t("applications.table.applicationType"),
      field: "submissionType",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 125,
      minWidth: 50,
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
      width: 125,
      minWidth: 50,
      comparator: compareStrings,
    },
    {
      headerName: t("application.name.lastName"),
      field: "applicant.lastName",
      colId: "lastName",
      sortable: true,
      unSortIcon: true,
      filter: "agTextColumnFilter",
      width: 125,
      minWidth: 50,
      comparator: compareStrings,
    },
    {
      headerName: t("application.details.householdSize"),
      field: "householdSize",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 120,
      minWidth: 50,
      type: "rightAligned",
    },
    {
      headerName: t("applications.table.declaredAnnualIncome"),
      field: "income",
      sortable: false,
      unSortIcon: true,
      filter: false,
      width: 110,
      minWidth: 50,
      type: "rightAligned",
      valueGetter: (row) => {
        if (!row?.data?.income || !row?.data?.incomePeriod) return ""

        const { income, incomePeriod } = row.data

        return incomePeriod === IncomePeriodEnum.perYear
          ? formatIncome(income, incomePeriod, IncomePeriodEnum.perYear)
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
      width: 110,
      minWidth: 50,
      type: "rightAligned",
      valueGetter: (row) => {
        if (!row?.data?.income || !row?.data?.incomePeriod) return ""

        const { income, incomePeriod } = row.data

        return incomePeriod === IncomePeriodEnum.perMonth
          ? formatIncome(income, incomePeriod, IncomePeriodEnum.perMonth)
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
      width: 100,
      minWidth: 50,
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
      width: 110,
      minWidth: 50,
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
      width: 180,
      minWidth: 50,
      valueGetter: (row) => {
        if (!row?.data?.preferences) return ""

        const { preferences } = row.data

        const claimed = preferences.reduce((acc, curr) => {
          if (curr.claimed) {
            acc.push(curr.key)
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
      width: 125,
      minWidth: 50,
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
      width: 250,
      minWidth: 50,
    },
    {
      headerName: t("t.phone"),
      field: "applicant.phoneNumber",
      sortable: false,
      filter: false,
      width: 150,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.phoneType"),
      field: "applicant.phoneNumberType",
      sortable: false,
      filter: false,
      width: 90,
      minWidth: 50,
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
      minWidth: 50,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return value ? value : t("t.none")
      },
    },
    {
      headerName: t("applications.table.additionalPhoneTypeShortened"),
      field: "additionalPhoneNumberType",
      sortable: false,
      filter: false,
      width: 90,
      minWidth: 50,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return value ? t(`application.contact.phoneNumberTypes.${value}`) : t("t.none")
      },
    },
  ]

  if (enableFullTimeStudentQuestion) {
    defs.push({
      headerName: t("application.details.fullTimeStudent"),
      field: "applicant.fullTimeStudent",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
      valueFormatter: ({ value }) => {
        if (!value) return ""
        return formatYesNoLabel(value)
      },
    })
  }

  defs.push(
    {
      headerName: t("applications.table.residenceStreet"),
      field: "applicant.applicantAddress.street",
      sortable: false,
      filter: false,
      width: 250,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.residenceCity"),
      field: "applicant.applicantAddress.city",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.residenceState"),
      field: "applicant.applicantAddress.state",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.residenceZip"),
      field: "applicant.applicantAddress.zipCode",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.mailingStreet"),
      field: "applicationsMailingAddress.street",
      sortable: false,
      filter: false,
      width: 250,
      minWidth: 50,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""
        return `${data.sendMailToMailingAddress ? value : data.applicant.applicantAddress.street}`
      },
    },
    {
      headerName: t("applications.table.mailingCity"),
      field: "applicationsMailingAddress.city",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 50,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.applicantAddress.city}`
      },
    },
    {
      headerName: t("applications.table.mailingState"),
      field: "applicationsMailingAddress.state",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.applicantAddress.state}`
      },
    },
    {
      headerName: t("applications.table.mailingZip"),
      field: "applicationsMailingAddress.zipCode",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
      valueFormatter: function ({ data, value }) {
        if (!value) return ""

        return `${data.sendMailToMailingAddress ? value : data.applicant.applicantAddress.zipCode}`
      },
    },
    {
      headerName: t("applications.table.altContactFirstName"),
      field: "alternateContact.firstName",
      sortable: false,
      filter: false,
      width: 125,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.altContactLastName"),
      field: "alternateContact.lastName",
      sortable: false,
      filter: false,
      width: 125,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.altContactRelationship"),
      field: "alternateContact.type",
      sortable: false,
      filter: false,
      width: 135,
      minWidth: 50,
      valueFormatter: ({ data, value }: { data: Application; value: string }) => {
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
      minWidth: 50,
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
      width: 250,
      minWidth: 50,
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
      field: "alternateContact.address.street",
      sortable: false,
      filter: false,
      width: 250,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.altContactCity"),
      field: "alternateContact.address.city",
      sortable: false,
      filter: false,
      width: 120,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.altContactState"),
      field: "alternateContact.address.state",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
    },
    {
      headerName: t("applications.table.altContactZip"),
      field: "alternateContact.address.zipCode",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
    }
  )

  const householdCols = []

  for (let i = 0; i < maxHouseholdSize - 1; i++) {
    const householdIndex = i + 1

    householdCols.push(
      {
        headerName: `${t("application.name.firstName")} HH:${householdIndex}`,
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 50,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          return value[i]?.firstName ? value[i].firstName : ""
        },
      },
      {
        headerName: `${t("application.name.lastName")} HH:${householdIndex}`,
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 50,
        valueFormatter: ({ value }) => {
          if (!value) return ""

          return value[i]?.lastName ? value[i].lastName : ""
        },
      },
      {
        headerName: `${t("applications.table.householdDob")} HH:${householdIndex}`,
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 50,
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
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 135,
        minWidth: 50,
        valueFormatter: ({ value }) => {
          if (!value) return ""
          return value[i]?.relationship
            ? t(`application.form.options.relationship.${value[i].relationship}`)
            : ""
        },
      },
      {
        headerName: `${t("application.add.sameAddressAsPrimary")} HH:${householdIndex}`,
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 115,
        minWidth: 50,
        valueFormatter: ({ value }) => {
          if (value.length < householdIndex) return ""
          return formatYesNoLabel(value[i]?.sameAddress)
        },
      }
    )
    if (enableFullTimeStudentQuestion) {
      householdCols.push({
        headerName: `${t("application.details.fullTimeStudent")} HH:${householdIndex}`,
        field: "householdMember",
        sortable: false,
        filter: false,
        width: 90,
        minWidth: 50,
        valueFormatter: ({ value }) => {
          if (value?.length < householdIndex) return ""
          return formatYesNoLabel(value[i]?.fullTimeStudent)
        },
      })
    }
  }

  const duplicateCols = [
    {
      headerName: t("applications.duplicates.flaggedAsDuplicate"),
      field: "flagged",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
      valueFormatter: ({ value }) => {
        return formatYesNoLabel(value)
      },
    },
    {
      headerName: t("applications.duplicates.markedAsDuplicate"),
      field: "markedAsDuplicate",
      sortable: false,
      filter: false,
      width: 110,
      minWidth: 50,
      valueFormatter: ({ value }) => {
        return formatYesNoLabel(value)
      },
    },
  ]

  return [...defs, ...householdCols, ...duplicateCols]
}
