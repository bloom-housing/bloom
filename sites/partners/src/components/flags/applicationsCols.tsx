import Link from "next/link"

import { t } from "@bloom-housing/ui-components"
import { convertDataToLocal } from "../../lib/helpers"
import { ApplicationSubmissionType } from "@bloom-housing/backend-core/types"

export const getCols = () => [
  {
    headerName: t("application.details.number"),
    field: "id",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
    minWidth: 250,
    flex: 1,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRendererFramework: ({ data }) => {
      if (!data?.id && !data?.confirmationCode) return ""
      return <Link href={`/application/${data.id}`}>{data.confirmationCode || data.id}</Link>
    },
  },
  {
    headerName: t("application.name.firstName"),
    field: "applicant.firstName",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
    flex: 1,
  },
  {
    headerName: t("application.name.lastName"),
    field: "applicant.lastName",
    sortable: false,
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
    headerName: t("application.details.type"),
    field: "submissionType",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
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

      const dateTime = convertDataToLocal(
        submissionDate,
        data?.submissionType || ApplicationSubmissionType.electronical
      )

      return `${dateTime.date} ${t("t.at")} ${dateTime.time}`
    },
  },
  {
    headerName: t("applications.table.reviewStatus"),
    field: "reviewStatus",
    sortable: false,
    filter: false,
    resizable: true,
    flex: 1,
    valueGetter: ({ data }) => {
      return data.reviewStatus === "flagged" ? t("applications.pendingReview") : data.status
    },
  },
]
