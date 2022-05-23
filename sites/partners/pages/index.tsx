import React, { useMemo, useContext, useState, useRef, useEffect } from "react"
import Head from "next/head"
import {
  PageHeader,
  t,
  AuthContext,
  Button,
  LocalizedLink,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  debounce,
  LoadingOverlay,
  Field,
  AlertBox,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { AgGridReact } from "ag-grid-react"
import { GridOptions } from "ag-grid-community"
import { useForm } from "react-hook-form"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"

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
  const { profile } = useContext(AuthContext)
  const isAdmin = profile.roles?.isAdmin || false

  /* Filter input */
  const [delayedFilterValue, setDelayedFilterValue] = useState("")
  const [validSearch, setValidSearch] = useState<boolean>(true)

  /* Data Filtering */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()
  const filterField = watch("filter-input", "")
  const debounceFilter = useRef(debounce((value: string) => setDelayedFilterValue(value), 500))
  useEffect(() => {
    setCurrentPage(1)
    if (filterField.length === 0 || filterField.length > 2) {
      setValidSearch(true)
      debounceFilter.current(filterField)
    } else {
      setDelayedFilterValue("")
      setValidSearch(false)
    }
  }, [filterField])

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

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

  const gridOptions: GridOptions = {
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
        sortable: false,
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
    search: delayedFilterValue,
    userId: !isAdmin ? profile?.id : undefined,
  })

  if (listingsLoading) return "Loading..."
  if (listingsError) return "An error has occurred."

  // if (listingsError) return null

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
      <PageHeader title={t("nav.listings")} />
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
                  gridOptions={gridOptions}
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
                totalItems={listingDtos?.meta.totalItems}
                totalPages={listingDtos?.meta.totalPages}
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
