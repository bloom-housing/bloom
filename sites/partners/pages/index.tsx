import React, { useMemo, useContext } from "react"
import Head from "next/head"
import {
  t,
  Button,
  LocalizedLink,
  AgTable,
  AuthContext,
  useAgTable,
  PageHeader,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../src/MetaTags"
import { ListingStatus } from "@bloom-housing/backend-core/types"

class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.innerText = params.valueFormatted || params.value
    this.link.setAttribute("href", `/listings/${params.data.id}/`)
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

  const tableOptions = useAgTable()

  const gridComponents = {
    formatLinkCell,
    formatWaitlistStatus,
    ListingsLink,
  }

  const columnDefs = useMemo(() => {
    const columns: (ColDef | ColGroupDef)[] = [
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
        field: "verified",
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
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    listingIds: !isAdmin
      ? profile?.leasingAgentInListings?.map((listing) => listing.id)
      : undefined,
    sort: tableOptions.sort.sortOptions,
    view: "partnerList",
  })
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitlePartners")} description={metaDescription} />
      <PageHeader title={t("nav.listings")} className={"md:pt-16"} />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <AgTable
            id="listings-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            config={{
              gridComponents,
              columns: columnDefs,
              totalItemsLabel: t("listings.totalListings"),
            }}
            data={{
              items: listingDtos?.items,
              loading: listingsLoading,
              totalItems: listingDtos?.meta.totalItems,
              totalPages: listingDtos?.meta.totalPages,
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            sort={{
              setSort: tableOptions.sort.setSortOptions,
            }}
            headerContent={
              <div className="flex-row">
                {isAdmin && (
                  <LocalizedLink href={`/listings/add`}>
                    <Button className="mx-1" onClick={() => false}>
                      {t("listings.addListing")}
                    </Button>
                  </LocalizedLink>
                )}
              </div>
            }
          />
        </article>
      </section>
    </Layout>
  )
}
