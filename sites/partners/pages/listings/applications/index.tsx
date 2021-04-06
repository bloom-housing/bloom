import React, { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  Field,
  PageHeader,
  MetaTags,
  t,
  Button,
  debounce,
  lRoute,
  LocalizedLink,
} from "@bloom-housing/ui-components"
import { useApplicationsData, useListAsCsv } from "../../../lib/hooks"
import Layout from "../../../layouts/application"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"
import { getColDefs } from "../../../src/applications/ApplicationsColDefs"
import { GridOptions, ColumnApi, ColumnState } from "ag-grid-community"

const ApplicationsList = () => {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const COLUMN_STATE_KEY = "column-state"

  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  const [columnOrder, setColumnOrder] = useState<Record<string, string>>()

  const filterField = watch("filter-input", "")
  const [delayedFilterValue, setDelayedFilterValue] = useState(filterField)

  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)

  const listingId = router.query.listing as string
  const { appsData } = useApplicationsData({
    pageIndex,
    limit: pageSize,
    listingId,
    search: delayedFilterValue,
    orderBy: columnOrder?.orderBy,
    order: columnOrder?.order,
  })

  function fetchFilteredResults(value: string) {
    setDelayedFilterValue(value)
  }

  // load table state on initial render & pagination change (because the new data comes from API)
  useEffect(() => {
    const savedColumnState = sessionStorage.getItem(COLUMN_STATE_KEY)

    if (gridColumnApi && savedColumnState) {
      const parsedState: ColumnState[] = JSON.parse(savedColumnState)

      gridColumnApi.applyColumnState({
        state: parsedState,
        applyOrder: true,
      })
    }
  }, [gridColumnApi, pageIndex])

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
  }

  function getColumnOrder(api: ColumnApi) {
    const columnState = api.getColumnState()
    const colToSort = columnState
      .filter((col) =>
        ["submissionDate", "applicant.firstName", "applicant.lastName"].includes(col.colId)
      )
      .filter((item) => item.sort)?.[0]

    if (colToSort) {
      const orderByName = (() => {
        switch (colToSort.colId) {
          case "applicant.firstName":
            return "firstName"
          case "applicant.lastName":
            return "lastName"
          default:
            return colToSort.colId
        }
      })()

      setColumnOrder({
        orderBy: orderByName,
        order: colToSort.sort.toUpperCase(),
      })
    } else {
      setColumnOrder({})
    }
  }

  const debounceFilter = useRef(debounce((value: string) => fetchFilteredResults(value), 1000))

  // reset page to 1 when user change limit
  useEffect(() => {
    setPageIndex(1)
  }, [pageSize])

  // fetch filtered data
  useEffect(() => {
    setPageIndex(1)
    debounceFilter.current(filterField)
  }, [filterField])

  const applications = appsData?.items || []
  const appsMeta = appsData?.meta

  const pageSizeOptions = ["8", "100", "500", "1000"]
  const pageJumpOptions = Array.from(Array(appsMeta?.totalPages).keys())?.map((item) => item + 1)

  // action buttons
  const onBtNext = () => {
    setPageIndex(pageIndex + 1)
  }

  const onBtPrevious = () => {
    setPageIndex(pageIndex - 1)
  }

  const { mutate: mutateCsv, loading: loadingCsv } = useListAsCsv(listingId, true)

  const onExport = async () => {
    const content = await mutateCsv()

    const now = new Date()
    const dateString = moment(now).format("YYYY-MM-DD_HH:mm:ss")

    const blob = new Blob([content], { type: "text/csv" })
    const fileLink = document.createElement("a")
    fileLink.setAttribute("download", `appplications-${listingId}-${dateString}.csv`)
    fileLink.href = URL.createObjectURL(blob)

    fileLink.click()
  }

  // ag grid settings
  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")

      this.linkWithId.innerText = params.value

      this.linkWithId.addEventListener("click", function () {
        void saveColumnState(params.columnApi)
        void router.push(lRoute(`/application?id=${params.value}`))
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

  const gridOptions: GridOptions = {
    onSortChanged: (params) => {
      getColumnOrder(params.columnApi)
      saveColumnState(params.columnApi)
    },
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      formatLinkCell: formatLinkCell,
    },
  }

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  // get the highest value from householdSize and limit to 6
  const maxHouseholdSize = useMemo(() => {
    let max = 1

    appsData?.items.forEach((item) => {
      if (item.householdSize > max) {
        max = item.householdSize
      }
    })

    return max < 6 ? max : 6
  }, [appsData])

  const columnDefs = useMemo(() => {
    return getColDefs(maxHouseholdSize)
  }, [maxHouseholdSize])

  if (!applications) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("applications.applicationsReceived")} />

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56">
                <Field name="filter-input" register={register} placeholder={t("t.filter")} />
              </div>

              <div className="flex-row">
                <LocalizedLink href={`/listings/applications/add?listing=${listingId}`}>
                  <Button className="mx-1" onClick={() => false}>
                    {t("applications.addApplication")}
                  </Button>
                </LocalizedLink>

                <Button className="mx-1" onClick={() => onExport()} loading={loadingCsv}>
                  {t("t.export")}
                </Button>
              </div>
            </div>

            <div className="applications-table mt-5">
              <AgGridReact
                onGridReady={onGridReady}
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={applications}
                domLayout="autoHeight"
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

export default ApplicationsList
