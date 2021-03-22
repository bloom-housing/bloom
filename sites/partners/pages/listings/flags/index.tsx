import {
  AppearanceSizeType,
  AppearanceStyleType,
  Button,
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
import { ListingSecondaryNav } from "../../../src/listings/ListingSecondaryNav"

const ApplicationFlaggedSetList = () => {
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)
  const { register, watch } = useForm()
  const router = useRouter()
  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)
  const COLUMN_STATE_KEY = "column-state"

  // const listingId = router.query.listing as string
  // Hardcoded listing id for testing
  const listingId = "5fd1a87d-8957-4e47-9104-f81b45f8eb6c"
  const { appsData } = useApplicationFlaggedSetData(pageIndex, pageSize, listingId)
  const appsMeta = appsData?.meta
  const afs = appsData?.items || []

  console.log("netrA afs ",afs)
  // action buttons
  const onBtNext = () => {
    setPageIndex(pageIndex + 1)
  }

  const onBtPrevious = () => {
    setPageIndex(pageIndex - 1)
  }

  const pageSizeOptions = ["8", "100", "500", "1000"]
  const pageJumpOptions = Array.from(Array(appsMeta?.totalPages).keys())?.map((item) => item + 1)

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")

      this.linkWithId.innerText =
        params.data.applications[0].applicant.firstName +
        " " +
        params.data.applications[0].applicant.lastName +
        " + " +
        params.data.applications.length

      this.linkWithId.addEventListener("click", function () {
        void saveColumnState(params.columnApi)
        void router.push(lRoute(`/applicationFlaggedSets?id=${params.data.id}`))
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
    this.api.sizeColumnsToFit()
  }

  const gridOptions: GridOptions = {
    onSortChanged: (params) => saveColumnState(params.columnApi),
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      formatLinkCell: formatLinkCell,
    },
  }

  const defaultColDef = {
    resizable: true,
    maxWidth: 400,
  }

  const columnDefs = useMemo(
    () => [
      {
        headerName: t("application.household.primaryApplicant"),
        field: "applications",
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: formatLinkCell,
        valueFormatter: ({ value }) => {
          if (!value?.length) return
          const { firstName, lastName } = value[0]?.applicant
          return `${firstName} ${lastName} + ` + value.length
        },
      },
      {
        headerName: t("flaggedSet.ruleName"),
        field: "rule",
        sortable: false,
        filter: false,
        resizable: false,
        valueFormatter: ({ value }) => {
          if (!value?.length) return
          value = value.replace("and", "+")
          return value
        },
      },
      {
        headerName: t("flaggedSet.NoOfApplications"),
        field: "applications",
        sortable: false,
        filter: false,
        resizable: false,
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
        resizable: false,
        flex: 1,
        cellRendererFramework: function (params) {
          return params.data.status == "flagged" ? (
            <Tag
              pillStyle={true}
              size={AppearanceSizeType.small}
              styleType={AppearanceStyleType.flagged}
            >
              {params.data.status}
            </Tag>
          ) : (
            <Tag
              pillStyle={true}
              size={AppearanceSizeType.small}
              styleType={AppearanceStyleType.success}
            >
              {params.data.status}
            </Tag>
          )
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
      {/* TODO: change translation and pass flags quantity */}
      <ListingSecondaryNav title={"Flags"} listingId={listingId} flagsQty={0} />

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
              <div className="data-pager">
                <Button
                  className="data-pager__previous data-pager__control"
                  onClick={onBtPrevious}
                  disabled={pageIndex === 1}
                >
                  {t("t.previous")}
                </Button>

                <div className="data-pager__control-group">
                  <span className="data-pager__control">
                    <span className="field-label" id="lbTotalPages">
                      {appsMeta?.totalItems}
                    </span>
                    <span className="field-label">{t("applications.totalApplications")}</span>
                  </span>

                  <span className="field data-pager__control">
                    <label className="field-label font-sans" htmlFor="page-size">
                      {t("t.show")}
                    </label>
                    <select name="page-size" id="page-size" ref={register} defaultValue={8}>
                      {pageSizeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span className="field data-pager__control">
                    <label className="field-label font-sans" htmlFor="page-jump">
                      {t("t.jumpTo")}
                    </label>
                    <select
                      name="page-jump"
                      id="page-jump"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setPageIndex(parseInt(e.target.value))
                      }
                      value={pageIndex}
                    >
                      {pageJumpOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>

                <Button
                  className="data-pager__next data-pager__control"
                  onClick={onBtNext}
                  disabled={appsMeta?.totalPages === pageIndex}
                >
                  {t("t.next")}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationFlaggedSetList
