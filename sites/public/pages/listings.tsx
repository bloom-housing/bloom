import Head from "next/head"
import {
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  t,
  encodeToFrontendFilterString,
  ListingFilterState,
  FrontendListingFilterStateKeys,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useState } from "react"
import { useRouter } from "next/router"
import FilterForm from "../src/forms/filters/FilterForm"
import { getListings } from "../lib/helpers"
import { fetchBaseListingData } from "../lib/hooks"
import FindRentalsForMeLink from "../lib/FindRentalsForMeLink"

const ListingsPage = ({ initialListings }) => {
  const router = useRouter()

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const onSubmit = (page: number, data: ListingFilterState) => {
    if (data[FrontendListingFilterStateKeys.includeNulls] === false) {
      delete data[FrontendListingFilterStateKeys.includeNulls]
    }
    setFilterModalVisible(false)
    void router.push(`/listings/filtered?page=${page}${encodeToFrontendFilterString(data)}`)
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader
        className="listings-title"
        title={t("pageTitle.rent")}
        inverse={true}
        tabNav={<FindRentalsForMeLink title={t("welcome.findRentalsForMe")} />}
      />
      <Modal
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
      >
        <FilterForm onSubmit={(data) => onSubmit(/*page=*/ 1, data)} />
      </Modal>
      <div className="container max-w-3xl px-4 content-start mx-auto">
        <Button
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          onClick={() => setFilterModalVisible(true)}
        >
          {t("listingFilters.buttonTitle")}
        </Button>
      </div>
      {initialListings?.meta?.totalItems === 0 && (
        <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
          <header>
            <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
            <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
          </header>
        </div>
      )}
      {initialListings?.meta?.totalItems > 0 && (
        <div>
          {initialListings?.meta?.totalItems > 0 && getListings(initialListings?.items)}
          <AgPagination
            totalItems={initialListings?.meta.totalItems}
            totalPages={initialListings?.meta.totalPages}
            currentPage={1}
            itemsPerPage={10}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={(page) => onSubmit(page, {})}
            includeBorder={false}
            matchListingCardWidth={true}
          />
        </div>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  const initialListings = await fetchBaseListingData()
  return { props: { initialListings }, revalidate: process.env.cacheRevalidate }
}

export default ListingsPage
