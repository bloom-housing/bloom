import React, { useMemo, useContext, useEffect, useRef, useState, useCallback } from "react"
import Head from "next/head"
import {
  PageHeader,
  t,
  AuthContext,
  Button,
  LocalizedLink,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  LoadingOverlay,
} from "@bloom-housing/ui-components"
import { AgGridReact } from "ag-grid-react"
import { ColumnApi, ColumnState, GridOptions } from "ag-grid-community"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"
import { ListingStatus, OrderByFieldsEnum, OrderDirEnum } from "@bloom-housing/backend-core/types"
import dayjs from "dayjs"

const COLUMN_STATE_KEY = "column-state"

type ListingListSortOptions = {
  orderBy: OrderByFieldsEnum
  orderDir: OrderDirEnum
}

export default function ListingsList() {
  const { profile } = useContext(AuthContext)
  const isAdmin = profile.roles?.isAdmin || false

  const router = useRouter()

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  /* OrderBy columns */
  const [sortOptions, setSortOptions] = useState<ListingListSortOptions>({
    orderBy: OrderByFieldsEnum.name,
    orderDir: OrderDirEnum.ASC,
  })

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  function saveColumnState(api: ColumnApi) {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(COLUMN_STATE_KEY, columnStateJSON)
  }

  function onGridReady(params) {
    setGridColumnApi(params.columnApi)
  }

  class formatLinkCell {
    link: HTMLAnchorElement

    init(params) {
      this.link = document.createElement("a")
      this.link.classList.add("text-blue-700")
      this.link.innerText = params.valueFormatted || params.value
      this.link.addEventListener("click", function () {
        void saveColumnState(params.columnApi)
        void router.push(`/listings/${params.data.id}`)
      })
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

    let col = colId
    if (colId === "isVerified") {
      col = "verified"
    }
    const allowedSortColIds: string[] = Object.values(OrderByFieldsEnum)
    if (allowedSortColIds.includes(col)) {
      const name = OrderByFieldsEnum[col]
      setSortOptions({
        orderBy: name,
        orderDir: sort.toUpperCase() as OrderDirEnum,
      })
    }
  }, [])

  const columnDefs = useMemo(() => {
    const columns = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: true,
        unSortIcon: true,
        sort: "asc",
        filter: false,
        width: 350,
        minWidth: 100,
        cellRenderer: "formatLinkCell",
      },
      {
        headerName: t("listings.buildingAddress"),
        field: "buildingAddress.street",
        sortable: false,
        filter: false,
        width: 350,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? value : t("t.none")),
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: true,
        unSortIcon: true,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          switch (value) {
            case ListingStatus.active:
              return t("t.public")
            case ListingStatus.pending:
              return t("t.draft")
            case ListingStatus.closed:
              return t("listings.closed")
            default:
              return ""
          }
        },
      },
      {
        headerName: t("listings.verified"),
        field: "isVerified",
        sortable: true,
        unSortIcon: true,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? t("t.yes") : t("t.no")),
      },
      {
        headerName: t("listing.lastUpdated"),
        field: "updatedAt",
        sortable: true,
        filter: false,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
      },
    ]
    return columns
  }, [])

  const { listingDtos, listingsLoading } = useListingsData({
    page: currentPage,
    limit: itemsPerPage,
    listingIds: !isAdmin
      ? profile?.leasingAgentInListings?.map((listing) => listing.id)
      : undefined,
    orderBy: sortOptions.orderBy,
    orderDir: sortOptions.orderDir,
    view: "partnerList",
  })

  const gridOptions: GridOptions = {
    onSortChanged: (params) => {
      saveColumnState(params.columnApi)
      onSortChange(params.columnApi.getColumnState())
    },
    components: {
      formatLinkCell,
      formatWaitlistStatus,
    },
    suppressNoRowsOverlay: listingsLoading,
  }

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

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags
        title={t("nav.siteTitlePartners")}
        image={metaImage}
        description={metaDescription}
      />
      <PageHeader title={t("nav.listings")} className={"md:pt-16"} />
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
              <LoadingOverlay isLoading={listingsLoading}>
                <AgGridReact
                  onGridReady={onGridReady}
                  gridOptions={gridOptions}
                  defaultColDef={{
                    resizable: true,
                  }}
                  columnDefs={columnDefs}
                  rowData={listingDtos?.items}
                  domLayout={"autoHeight"}
                  headerHeight={83}
                  rowHeight={58}
                  suppressPaginationPanel={true}
                  paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                  suppressScrollOnNewData={true}
                ></AgGridReact>
              </LoadingOverlay>

              <AgPagination
                totalItems={listingDtos?.meta?.totalItems}
                totalPages={listingDtos?.meta?.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("listings.totalListings")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                onPerPageChange={() => setCurrentPage(1)}
                includeBorder={true}
              />
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}
