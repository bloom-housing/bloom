import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import Head from "next/head"
import {
  Field,
  t,
  Button,
  debounce,
  LocalizedLink,
  AuthContext,
  SiteAlert,
  setSiteAlertMessage,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  LoadingOverlay,
  AlertBox,
} from "@bloom-housing/ui-components"
import { useSingleListingData, useFlaggedApplicationsList } from "../../../../lib/hooks"
import { ApplicationSecondaryNav } from "../../../../src/applications/ApplicationSecondaryNav"
import Layout from "../../../../layouts"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"
import { getColDefs } from "../../../../src/applications/ApplicationsColDefs"
import { GridOptions, ColumnApi, ColumnState } from "ag-grid-community"
import {
  Application,
  EnumApplicationsApiExtraModelOrder,
  EnumApplicationsApiExtraModelOrderBy,
  PaginationMeta,
} from "@bloom-housing/backend-core/types"

type ApplicationsListSortOptions = {
  orderBy: EnumApplicationsApiExtraModelOrderBy
  order: EnumApplicationsApiExtraModelOrder
}

const ApplicationsList = () => {
  const COLUMN_STATE_KEY = "column-state"
  const { applicationsService } = useContext(AuthContext)
  const router = useRouter()

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  /* Grid Data */
  const [applications, setApplications] = useState<Application[] | null>()
  const [appsError, setAppsError] = useState()
  const [appsMeta, setAppsMeta] = useState<PaginationMeta | null>()
  const [appsLoading, setAppsLoading] = useState<boolean>(true)

  /* Filter input */
  const [delayedFilterValue, setDelayedFilterValue] = useState("")
  const [validSearch, setValidSearch] = useState<boolean>(true)

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  /* CSV export */
  const [csvExportLoading, setCsvExportLoading] = useState(false)
  const [csvExportError, setCsvExportError] = useState(false)

  /* OrderBy columns */
  const [sortOptions, setSortOptions] = useState<ApplicationsListSortOptions>({
    orderBy: null,
    order: null,
  })

  /* Data Fetching */
  const listingId = router.query.id as string
  const { listingDto } = useSingleListingData(listingId)
  const countyCode = listingDto?.countyCode
  const listingName = listingDto?.name
  const { data: flaggedApps } = useFlaggedApplicationsList({
    listingId,
    page: 1,
    limit: 1,
  })
  useEffect(() => {
    setAppsLoading(true)
    const params = {
      listingId,
      page: currentPage,
      limit: itemsPerPage,
    }
    if (delayedFilterValue) {
      Object.assign(params, { search: delayedFilterValue })
    }
    if (sortOptions.orderBy) {
      Object.assign(params, { orderBy: sortOptions.orderBy, order: sortOptions.order ?? "ASC" })
    }
    applicationsService
      .list(params)
      .then((res) => {
        setApplications(res?.items)
        setAppsMeta(res?.meta)
        setAppsLoading(false)
      })
      .catch((e) => {
        setAppsError(e.response.data.error)
        setAppsLoading(false)
      })
  }, [
    applicationsService,
    currentPage,
    delayedFilterValue,
    itemsPerPage,
    listingId,
    sortOptions.order,
    sortOptions.orderBy,
  ])

  /* Data Filtering */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()
  const filterField = watch("filter-input", "")
  const fetchFilteredResults = (value: string) => {
    if (value.length === 0 || value.length > 2) {
      setDelayedFilterValue(value)
      setValidSearch(true)
    } else {
      setDelayedFilterValue("")
      setValidSearch(false)
    }
  }
  const debounceFilter = useRef(debounce((value: string) => fetchFilteredResults(value), 500))
  useEffect(() => {
    setCurrentPage(1)
    debounceFilter.current(filterField)
  }, [filterField])

  /* Pagination */
  // reset page to 1 when user change limit
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  /* Data Performance */
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

  /* CSV and Export */
  const onExport = async () => {
    setCsvExportError(false)
    setCsvExportLoading(true)

    try {
      const content = await applicationsService.listAsCsv({
        listingId,
      })

      const now = new Date()
      const dateString = dayjs(now).format("YYYY-MM-DD_HH:mm:ss")

      const blob = new Blob([content], { type: "text/csv" })
      const fileLink = document.createElement("a")
      fileLink.setAttribute("download", `applications-${listingId}-${dateString}.csv`)
      fileLink.href = URL.createObjectURL(blob)
      fileLink.click()
    } catch (err) {
      setCsvExportError(true)
      setSiteAlertMessage(err.response.data.error, "alert")
    }

    setCsvExportLoading(false)
  }

  /* Grid Functionality and Formatting */
  // update table items order on sort change
  const initialLoadOnSort = useRef<boolean>(false)

  const onSortChange = useCallback((columns: ColumnState[]) => {
    // prevent multiple fetch on initial render
    if (!initialLoadOnSort.current) {
      initialLoadOnSort.current = true
      return
    }

    const sortedBy = columns.find((col) => col.sort)
    const { colId, sort } = sortedBy || {}

    const allowedSortColIds: string[] = Object.values(EnumApplicationsApiExtraModelOrderBy)

    if (allowedSortColIds.includes(colId)) {
      const name = EnumApplicationsApiExtraModelOrderBy[colId]

      setSortOptions({
        orderBy: name,
        order: sort.toUpperCase() as EnumApplicationsApiExtraModelOrder,
      })
    }
  }, [])

  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.innerText = params.value

      this.linkWithId.addEventListener("click", function () {
        void saveColumnState(params.columnApi)
        void router.push(`/application/${applicationId}`)
      })
    }

    getGui() {
      return this.linkWithId
    }
  }
  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }
  // get the highest value from householdSize and limit to 6
  const maxHouseholdSize = useMemo(() => {
    let max = 1

    applications?.forEach((item) => {
      if (item.householdSize > max) {
        max = item.householdSize
      }
    })

    return max < 6 ? max : 6
  }, [applications])

  const columnDefs = useMemo(() => {
    return getColDefs(maxHouseholdSize, countyCode)
  }, [maxHouseholdSize, countyCode])

  const gridOptions: GridOptions = {
    onSortChanged: (params) => {
      saveColumnState(params.columnApi)
      onSortChange(params.columnApi.getColumnState())
    },
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      formatLinkCell: formatLinkCell,
    },
    suppressNoRowsOverlay: appsLoading,
  }
  if (!applications || appsError) return null
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
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
              <div className="flex flex-wrap">
                <div className="mr-5 w-56">
                  <Field name="filter-input" register={register} placeholder={t("t.filter")} />
                </div>
                <div className="mt-2">
                  {!validSearch && (
                    <AlertBox type="notice">{t("applications.table.searchError")}</AlertBox>
                  )}
                </div>
              </div>
              <div className="flex-row">
                <LocalizedLink href={`/listings/${listingId}/applications/add`}>
                  <Button
                    className="mx-1"
                    onClick={() => false}
                    dataTestId={"addApplicationButton"}
                  >
                    {t("applications.addApplication")}
                  </Button>
                </LocalizedLink>

                <Button className="mx-1" onClick={() => onExport()} loading={csvExportLoading}>
                  {t("t.export")}
                </Button>
              </div>
            </div>
            <div className="applications-table mt-5">
              <LoadingOverlay isLoading={appsLoading}>
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
                  paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                  suppressScrollOnNewData={true}
                ></AgGridReact>
              </LoadingOverlay>
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
