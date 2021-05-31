import Link from "next/link"

import { t } from "@bloom-housing/ui-components"
import { convertDataToPst } from "../../lib/helpers"
import { ApplicationSubmissionType } from "@bloom-housing/backend-core/types"

export const getCols = () => [
  {
    headerName: t("application.details.number"),
    field: "id",
    sortable: true,
    filter: false,
    resizable: true,
    unSortIcon: true,
    minWidth: 250,
    flex: 1,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRendererFramework: ({ data }) => {
      if (!data?.id) return ""
      return <Link href={`/application/${data.id}`}>{data.id}</Link>
    },
  },
  {
    headerName: t("application.name.firstName"),
    field: "applicant.firstName",
    sortable: true,
    filter: false,
    resizable: true,
    unSortIcon: true,
    flex: 1,
  },
  {
    headerName: t("application.name.lastName"),
    field: "applicant.lastName",
    sortable: true,
    filter: false,
    resizable: true,
    unSortIcon: true,
    flex: 1,
  },
  {
    headerName: t("applications.table.primaryDob"),
    field: "applicant",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
    flex: 1,
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
    resizable: true,
    flex: 1,
  },
  {
    headerName: t("t.phone"),
    field: "applicant.phoneNumber",
    sortable: false,
    filter: false,
    resizable: true,
    flex: 1,
  },
  {
    headerName: t("applications.table.applicationSubmissionDate"),
    field: "submissionDate",
    sortable: false,
    filter: false,
    resizable: true,
    flex: 1,
    valueGetter: ({ data }) => {
      if (!data?.submissionDate) return ""

      const { submissionDate } = data

      const dateTime = convertDataToPst(
        submissionDate,
        data?.submissionType || ApplicationSubmissionType.electronical
      )

      return `${dateTime.date} ${t("t.at")} ${dateTime.time}`
    },
  },
]
