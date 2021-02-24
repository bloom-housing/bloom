import {
  AppearanceSizeType,
  AppearanceStyleType,
  lRoute,
  t,
  Tag,
} from "@bloom-housing/ui-components"
import { ColumnApi, GridOptions } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import Layout from "../../../layouts/application"
import { useApplicationFlaggedSetData } from "../../../lib/hooks"

const ApplicationFlaggedSetList = () => {
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const { watch } = useForm()
  const router = useRouter()
  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)
  const COLUMN_STATE_KEY = "column-state"

  const listingId = router.query.listing as string
  const { appsData } = useApplicationFlaggedSetData(pageIndex, pageSize, listingId)
  const afs = appsData?.items || []

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
    this.api.sizeColumnsToFit()
  }
  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")

      let rule = params.data.rule
      rule = rule.replace("and", "+")
      this.linkWithId.innerText =
        params.data.applications[0].applicant.firstName +
        " " +
        params.data.applications[0].applicant.lastName +
        ": " +
        rule

      this.linkWithId.addEventListener("click", function () {
        void saveColumnState(params.columnApi)
        void router.push(lRoute(`/applicationFlaggedSets?id=${params.data.id}`))
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

  const gridOptions: GridOptions = {
    onSortChanged: (params) => saveColumnState(params.columnApi),
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      formatLinkCell: formatLinkCell,
    },
  }
  const columnDefs = useMemo(
    () => [
      {
        headerName: t("flaggedSet.flaggedSet"),
        field: "firstName&lastName&rule",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: formatLinkCell,
      },
      {
        headerName: t("application.household.primaryApplicant"),
        field: "applications",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => {
          if (!value?.length) return

          const { firstName, lastName } = value[0]?.applicant
          return `${firstName} ${lastName}`
        },
      },
      {
        headerName: t("flaggedSet.ruleName"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => {
          if (!value?.length) return
          value = value.replace("and", "+")
          return value
        },
      },
      {
        headerName: t("flaggedSet.pendingReview"),
        field: "applications",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => {
          if (!value?.length) return 0
          return value.length
        },
      },
      {
        headerName: t("application.status"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        cellRendererFramework: function (params) {
          if (params.data.status == "flagged") {
            return (
              <Tag
                pillStyle={true}
                size={AppearanceSizeType.small}
                styleType={AppearanceStyleType.flagged}
              >
                {params.data.status}
              </Tag>
            )
          } else {
            return (
              <Tag
                pillStyle={true}
                size={AppearanceSizeType.small}
                styleType={AppearanceStyleType.success}
              >
                {params.data.status}
              </Tag>
            )
          }
        },
      },
    ],
    []
  )

  // reset page to 1 when user change limit
  useEffect(() => {
    setPageIndex(1)
  }, [pageSize])

  return (
    <Layout>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                onGridReady={onGridReady}
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={afs}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={8}
                suppressScrollOnNewData={true}
              ></AgGridReact>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationFlaggedSetList
