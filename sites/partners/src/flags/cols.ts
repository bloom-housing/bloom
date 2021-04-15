import {
  t,
  AppearanceStyleType,
  AppearanceSizeType,
  AppearanceShadeType,
} from "@bloom-housing/ui-components"
import { EnumApplicationFlaggedSetStatus } from "@bloom-housing/backend-core/types"

export const getCols = () => [
  {
    headerName: t("flags.flaggedSet"),
    field: "rule",
    sortable: false,
    filter: false,
    resizable: true,
    minWidth: 300,
    flex: 1,
    valueGetter: ({ data }) => {
      if (!data?.applications || !data?.rule) return ""

      const { applicant } = data?.applications?.[0]
      const rule = data?.rule

      const firstApplicant = `${applicant.firstName} ${applicant.lastName}`

      return `${firstApplicant}: ${rule}`
    },
  },
  {
    headerName: t("application.household.primaryApplicant"),
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
    field: "rule",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: `# ${t("nav.applications")}`,
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    valueFormatter: ({ value }) => value.length,
  },
  {
    headerName: t("application.status"),
    field: "status",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    cellRenderer: "tag",
    cellRendererParams: ({ value }) => ({
      pillStyle: true,
      children: value,
      shade: AppearanceShadeType.light,
      size: AppearanceSizeType.small,
      styleType:
        value === EnumApplicationFlaggedSetStatus.flagged
          ? AppearanceStyleType.alert
          : AppearanceStyleType.success,
    }),
  },
]
