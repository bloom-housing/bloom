import Head from "next/head"
import { ListingsList, PageHeader, AgPagination, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  const router = useRouter()

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  function setPage(page: number) {
    if (page != currentPage) {
      void router.push(
        {
          pathname: "/listings",
          query: { page: page },
        },
        undefined,
        { shallow: true }
      )
      setCurrentPage(page)
    }
  }

  // Checks if the url is updated manually.
  useEffect(() => {
    if (router.query.page && Number(router.query.page) != currentPage) {
      setCurrentPage(Number(router.query.page))
    }
  }, [router.query.page])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      {!listingsLoading && (
        <div>
          {listingsData && <ListingsList listings={listingsData.items} />}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            sticky={true}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={setPage}
          />
        </div>
      )}
    </Layout>
  )
}

export default ListingsPage
