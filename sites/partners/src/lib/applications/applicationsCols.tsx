import Link from "next/link"

import { t } from "@bloom-housing/ui-components"
import { ApplicationSubmissionTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { convertDataToLocal } from "../helpers"

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
      return (
        <span className={"text-blue-900"}>
          <Link href={`/application/${data.id}`}>{data.confirmationCode ?? t("t.n/a")}</Link>
        </span>
      )
    },
    width: 180,
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
    width: 120,
  },
  {
    headerName: t("t.email"),
    field: "applicant.emailAddress",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
  },
  {
    headerName: t("application.details.type"),
    field: "submissionType",
    sortable: false,
    filter: false,
    resizable: true,
    unSortIcon: true,
    valueGetter: ({ data }) => {
      return data.submissionType === ApplicationSubmissionTypeEnum.electronical
        ? t("application.details.submissionType.digital")
        : t("application.details.submissionType.paper")
    },
    width: 130,
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

      const dateTime = convertDataToLocal(submissionDate)

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
