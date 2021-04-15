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
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
  {
    headerName: t("application.household.primaryApplicant"),
    field: "rule",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
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
