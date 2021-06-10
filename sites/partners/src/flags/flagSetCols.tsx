import Link from "next/link"

import { t, AppearanceStyleType, AppearanceSizeType, Tag } from "@bloom-housing/ui-components"
import { EnumApplicationFlaggedSetStatus } from "@bloom-housing/backend-core/types"

export const getFlagSetCols = () => [
  {
    headerName: t("flags.flaggedSet"),
    colId: "flaggedSet",
    sortable: false,
    filter: false,
    resizable: true,
    minWidth: 300,
    flex: 1,
    cellRendererFramework: ({ data }) => {
      if (!data?.applications || !data?.rule || !data?.id) return ""

      const { applicant } = data?.applications?.[0]
      const rule = data?.rule

      const firstApplicant = `${applicant.firstName} ${applicant.lastName}`

      return (
        <Link
          href={`/listings/${data.listing.id}/flags/${data.id}`}
        >{`${firstApplicant}: ${rule}`}</Link>
      )
    },
  },
  {
    headerName: t("application.household.primaryApplicant"),
    colId: "primaryApplicant",
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    valueFormatter: ({ value }) => {
      if (!value) return ""

      const uniqueNames = value
        .map((item) => [item.applicant.firstName, item.applicant.lastName])
        .reduce((acc, curr) => {
          const includesName = acc.filter((item) => item[0] === curr[0] && item[1] === curr[1])
            .length

          if (!includesName) {
            acc.push(curr)
          }

          return acc
        }, [])

      if (!uniqueNames.length) return ""

      return `${uniqueNames[0][0]} ${uniqueNames[0][1]} ${
        uniqueNames.length > 1 ? ` +${uniqueNames.length - 1}` : ""
      }`
    },
  },
  {
    headerName: t("flags.ruleName"),
    colId: "rule",
    field: "rule",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: `# ${t("nav.applications")}`,
    colId: "applications",
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    valueFormatter: ({ value }) => value.length,
  },
  {
    headerName: t("application.status"),
    colId: "status",
    field: "status",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    cellRendererFramework: ({ data }) => {
      const styleType =
        data.status === EnumApplicationFlaggedSetStatus.flagged
          ? AppearanceStyleType.info
          : AppearanceStyleType.success

      return (
        <Tag pillStyle={true} size={AppearanceSizeType.small} styleType={styleType}>
          {data.status}
        </Tag>
      )
    },
  },
]
