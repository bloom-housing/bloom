import Link from "next/link"

import { t } from "@bloom-housing/ui-components"
import { convertDataToPst } from "../../../lib/helpers"
import { ApplicationSubmissionType } from "@bloom-housing/backend-core/types"

export const getCols = () => [
  {
    headerName: t("application.details.number"),
    field: "id",
    sortable: false,
    filter: false,
    resizable: true,
    pinned: "left",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRendererFramework: ({ data }) => {
      if (!data?.id && !data?.confirmationCode) return ""
      return <Link href={`/application/${data.id}`}>{data.confirmationCode || data.id}</Link>
    },
    width: 175,
  },

  {
    headerName: t("application.name.firstName"),
    field: "applicant.firstName",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
  },
  {
    headerName: t("application.name.lastName"),
    field: "applicant.lastName",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
  },
  {
    headerName: t("applications.table.primaryDob"),
    field: "applicant",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
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
    valueGetter: ({ data }) => {
      return data.submissionType === ApplicationSubmissionType.electronical
        ? t("application.details.submissionType.digital")
        : t("application.details.submissionType.paper")
    },
  },
  {
    headerName: t("applications.table.applicationSubmissionDate"),
    field: "submissionDate",
    sortable: false,
    filter: false,
    resizable: true,
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
  {
    headerName: t("applications.table.reviewStatus"),
    field: "reviewStatus",
    pinned: "right",
    sortable: false,
    filter: false,
    resizable: true,
    valueGetter: ({ data }) => {
      if (data.reviewStatus === "valid") return t("applications.valid")
      if (data.reviewStatus === "pendingAndValid") return t("applications.validPending")
      if (data.reviewStatus === "duplicate") return t("applications.duplicate")
      return t("applications.pending")
    },
    width: 140,
  },
]

export default getCols
