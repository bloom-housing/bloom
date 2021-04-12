import { t } from "@bloom-housing/ui-components"

export const cols = [
  {
    headerName: t("application.household.primaryApplicant"),
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
  },
  {
    headerName: t("flaggedSet.ruleName"),
    field: "rule",
    sortable: false,
    filter: false,
    resizable: false,
  },
  {
    headerName: t("flaggedSet.NoOfApplications"),
    field: "applications",
    sortable: false,
    filter: false,
    resizable: false,
  },
  {
    headerName: t("application.status"),
    field: "status",
    sortable: false,
    filter: false,
    resizable: false,
    flex: 1,
  },
]
