import { t } from "@bloom-housing/ui-components"
import { NextRouter } from "next/router"

export const tableColumns = [
  {
    headerName: t("applications.duplicates.duplicateGroup"),
    field: "",
    sortable: false,
    filter: false,
    cellRenderer: "formatLinkCell",
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: t("applications.duplicates.primaryApplicant"),
    field: "",
    sortable: false,
    filter: false,
  },
  {
    headerName: t("t.rule"),
    field: "rule",
    sortable: false,
    filter: false,
  },
  {
    headerName: t("applications.pendingReview"),
    field: "",
    sortable: false,
    filter: false,
    type: "rightAligned",
  },
]

export const getLinkCellFormatter = (router: NextRouter) =>
  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.innerText = params.value

      this.linkWithId.addEventListener("click", function () {
        void router.push(`/application/${applicationId}/review`)
      })
    }

    getGui() {
      return this.linkWithId
    }
  }
