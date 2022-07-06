import React, { useState, useMemo, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgGridReact } from "ag-grid-react"
import { ListingStatusBar } from "../../../../src/listings/ListingStatusBar"
import { useFlaggedApplicationsList, useSingleListingData } from "../../../../lib/hooks"
import Layout from "../../../../layouts"
import {
  t,
  AgPagination,
  AG_PER_PAGE_OPTIONS,
  Breadcrumbs,
  BreadcrumbLink,
  NavigationHeader,
} from "@bloom-housing/ui-components"
import { getFlagSetCols } from "../../../../src/flags/flagSetCols"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.id as string

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // reset page to 1 when user change limit
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const { listingDto } = useSingleListingData(listingId)

  const { data } = useFlaggedApplicationsList({
    listingId,
    page: currentPage,
    limit: itemsPerPage,
  })

  const listingName = listingDto?.name

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  const columns = useMemo(() => getFlagSetCols(), [])

  if (!data) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <NavigationHeader
        title={listingName}
        listingId={listingId}
        tabs={{
          show: true,
          flagsQty: data?.meta?.totalFlagged,
          listingLabel: t("t.listingSingle"),
          applicationsLabel: t("nav.applications"),
          flagsLabel: t("nav.flags"),
        }}
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}`}>{listingName}</BreadcrumbLink>
            <BreadcrumbLink href={`/listings/${listingId}/flags`} current>
              {t("nav.flags")}
            </BreadcrumbLink>
          </Breadcrumbs>
        }
      />

      <ListingStatusBar status={listingDto?.status} />

      <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto mt-2 pb-8 px-4 w-full">
        <div className="ag-theme-alpine ag-theme-bloom">
          <div className="applications-table">
            <AgGridReact
              columnDefs={columns}
              rowData={data?.items}
              domLayout="autoHeight"
              headerHeight={83}
              rowHeight={58}
              defaultColDef={defaultColDef}
            ></AgGridReact>

            <AgPagination
              totalItems={data?.meta.totalItems}
              totalPages={data?.meta.totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              quantityLabel={t("applications.totalSets")}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        </div>
      </article>
    </Layout>
  )
}

export default FlagsPage
