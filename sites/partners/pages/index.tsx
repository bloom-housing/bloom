import React, { useMemo, useContext, useState, useCallback, useEffect } from "react"
import Head from "next/head"
import {
  PageHeader,
  t,
  AuthContext,
  Button,
  LocalizedLink,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { AgGridReact } from "ag-grid-react"
import { GridOptions, ColumnState, ColumnApi } from "ag-grid-community"

import { useListingsData, ColumnOrder } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"

const LISTING_COLUMN_STATE_KEY = "listing-column-state"
class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.innerText = params.valueFormatted || params.value
  }

  getGui() {
    return this.link
  }
}

class formatWaitlistStatus {
  text: HTMLSpanElement

  init({ data }) {
    const isWaitlistOpen = data.waitlistCurrentSize < data.waitlistMaxSize

    this.text = document.createElement("span")
    this.text.innerHTML = isWaitlistOpen ? t("t.yes") : t("t.no")
  }

  getGui() {
    return this.text
  }
}

class ApplicationsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.setAttribute("data-test-id", "listing-status-cell")
  }
}

class ListingsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}`)
  }
}

export default function ListingsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const { profile } = useContext(AuthContext)
  const isAdmin = profile.roles?.isAdmin || false

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  /* OrderBy columns */
  const [sortOptions, setSortOptions] = useState<ColumnOrder[]>([])

  // update table items order on sort change
  const onSortChange = useCallback((columns: ColumnState[]) => {
    const sortedColumns = columns.filter((col) => !!col.sort)

    setSortOptions(() =>
      sortedColumns.map((col) => ({
        orderBy: col.colId,
        orderDir: col.sort.toUpperCase(),
      }))
    )
  }, [])

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Load a table state on initial render & pagination change (because the new data comes from the API)
  useEffect(() => {
    const savedColumnState = sessionStorage.getItem(LISTING_COLUMN_STATE_KEY)

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
    sessionStorage.setItem(LISTING_COLUMN_STATE_KEY, columnStateJSON)
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
  }

  const gridOptions: GridOptions = {
    onSortChanged: (params) => {
      saveColumnState(params.columnApi)
      onSortChange(params.columnApi.getColumnState())
    },
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: {
      ApplicationsLink,
      formatLinkCell,
      formatWaitlistStatus,
      ListingsLink,
    },
  }

  const columnDefs = useMemo(() => {
    const columns = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: true,
        filter: false,
        resizable: true,
        cellRenderer: "ListingsLink",
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: false,
        filter: false,
        resizable: true,
        flex: 1,
        valueFormatter: ({ value }) => t(`listings.listingStatus.${value}`),
        cellRenderer: "ApplicationsLink",
      },
      {
        headerName: t("listings.applicationDeadline"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
      },
      {
        headerName: t("listings.availableUnits"),
        field: "unitsAvailable",
        sortable: false,
        filter: false,
        resizable: true,
      },
      {
        headerName: t("listings.waitlist.open"),
        field: "waitlistCurrentSize",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatWaitlistStatus",
      },
    ]
    return columns
  }, [])

  const { listingDtos, listingsLoading, listingsError } = useListingsData({
    page: currentPage,
    limit: itemsPerPage,
    userId: !isAdmin ? profile?.id : undefined,
    sort: sortOptions,
  })

  if (listingsLoading) return "Loading..."
  if (listingsError) return "An error has occurred."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitlePartners")} description={metaDescription} />
      <PageHeader title={t("nav.listings")} />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56"></div>
              <div className="flex-row">
                {isAdmin && (
                  <LocalizedLink href={`/listings/add`}>
                    <Button className="mx-1" onClick={() => false}>
                      {t("listings.addListing")}
                    </Button>
                  </LocalizedLink>
                )}
              </div>
            </div>

            <div className="applications-table mt-5">
              <AgGridReact
                onGridReady={onGridReady}
                gridOptions={gridOptions}
                multiSortKey="ctrl"
                columnDefs={columnDefs}
                rowData={listingDtos.items}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <AgPagination
                totalItems={listingDtos.meta.totalItems}
                totalPages={listingDtos.meta.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("listings.totalListings")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                onPerPageChange={() => setCurrentPage(1)}
              />
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}
