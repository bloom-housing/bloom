import React, { useState, useEffect, useRef, useMemo, useContext } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  Field,
  t,
  Button,
  debounce,
  lRoute,
  LocalizedLink,
  ApiClientContext,
  SiteAlert,
  setSiteAlertMessage,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
} from "@bloom-housing/ui-components"
import {
  useApplicationsData,
  useSingleListingData,
  useFlaggedApplicationsList,
} from "../../../../lib/hooks"
import { ApplicationSecondaryNav } from "../../../../src/applications/ApplicationSecondaryNav"
import Layout from "../../../../layouts"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"
import { getColDefs } from "../../../../src/applications/ApplicationsColDefs"
import { GridOptions, ColumnApi, ColumnState } from "ag-grid-community"

const ApplicationsList = () => {
  const COLUMN_STATE_KEY = "column-state"

  const { applicationsService } = useContext(ApiClientContext)
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  /* Filter input */
  const filterField = watch("filter-input", "")
  const [delayedFilterValue, setDelayedFilterValue] = useState(filterField)

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const listingId = router.query.id as string
  const { appsData } = useApplicationsData(currentPage, itemsPerPage, listingId, delayedFilterValue)
  const { listingDto } = useSingleListingData(listingId)
  const countyCode = listingDto?.countyCode
  const listingName = listingDto?.name

  const { data: flaggedApps } = useFlaggedApplicationsList({
    listingId,
    page: 1,
    limit: 1,
  })

  /* CSV export */
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)

  const fetchFilteredResults = (value: string) => {
    setDelayedFilterValue(value)
  }

  // Load a table state on initial render & pagination change (because the new data comes from the API)
  useEffect(() => {
    const savedColumnState = sessionStorage.getItem(COLUMN_STATE_KEY)

    if (gridColumnApi && savedColumnState) {
      const parsedState: ColumnState[] = JSON.parse(savedColumnState)

      gridColumnApi.applyColumnState({
        state: parsedState,
        applyOrder: true,
      })
    }
  }, [gridColumnApi, currentPage])

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
  }

  const debounceFilter = useRef(debounce((value: string) => fetchFilteredResults(value), 1000))

  // reset page to 1 when user change limit
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  // fetch filtered data
  useEffect(() => {
    setCurrentPage(1)
    debounceFilter.current(filterField)
  }, [filterField])

  const applications = appsData?.items || []
  const appsMeta = appsData?.meta

  const onExport = async () => {
    setCsvExportError(false)
    setCsvExportLoading(true)

    try {
      const content = await applicationsService.listAsCsv({
        listingId,
        includeHeaders: true,
      })

      const now = new Date()
      const dateString = moment(now).format("YYYY-MM-DD_HH:mm:ss")

      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", `applications-${listingId}-${dateString}.csv`)
      fileLink.href = URL.createObjectURL(blob)

      fileLink.click()
    } catch (err) {
      setCsvExportError(true)
      setSiteAlertMessage(t("errors.alert.timeoutPleaseTryAgain"), "alert")
      console.error(err)
    }

    setCsvExportLoading(false)
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
        void router.push(lRoute(`/application/${params.value}`))
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
    return getColDefs(maxHouseholdSize, countyCode)
  }, [maxHouseholdSize, countyCode])

  if (!applications) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      <ApplicationSecondaryNav
        title={listingName}
        listingId={listingId}
        flagsQty={flaggedApps?.meta?.totalFlagged}
      >
        {csvExportError && (
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="alert" timeout={5000} dismissable />
          </div>
        )}
      </ApplicationSecondaryNav>

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56">
                <Field name="filter-input" register={register} placeholder={t("t.filter")} />
              </div>

              <div className="flex-row">
                <LocalizedLink href={`/listings/${listingId}/applications/add`}>
                  <Button className="mx-1" onClick={() => false}>
                    {t("applications.addApplication")}
                  </Button>
                </LocalizedLink>

                <Button className="mx-1" onClick={() => onExport()} loading={csvExportLoading}>
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
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={8}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <AgPagination
                totalItems={appsMeta?.totalItems}
                totalPages={appsMeta?.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("applications.totalApplications")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
