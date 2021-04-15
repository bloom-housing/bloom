import {
  t,
  AppearanceStyleType,
  AppearanceSizeType,
  AppearanceShadeType,
} from "@bloom-housing/ui-components"
import { EnumApplicationFlaggedSetStatus } from "@bloom-housing/backend-core/types"

export const cols = [
  {
    headerName: t("flags.flaggedSet"),
    field: "rule",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: t("application.household.primaryApplicant"),
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
    valueFormatter: ({ value }) => {
      if (!value) return

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
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: `# ${t("flags.pendingReview")}`,
    field: "updatedAt",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: t("application.status"),
    field: "status",
    sortable: false,
    filter: false,
    resizable: false,
    cellRenderer: "tag",
    flex: 1,
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
