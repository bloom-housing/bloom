import Head from "next/head"
import {
  PageHeader,
  AgPagination,
  t,
  encodeToFrontendFilterString,
  LoadingOverlay,
  ListingFilterState,
  AuthContext,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../../src/MetaTags"
import React, { useEffect, useState, useContext, useMemo } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../../lib/hooks"
import { OrderByFieldsEnum } from "@bloom-housing/backend-core/types"
import { getListings } from "../../lib/helpers"

const FavoritedListingsPage = () => {
  const router = useRouter()
  const { profile } = useContext(AuthContext)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)

  const filterState = useMemo(() => {
    const filterState: ListingFilterState = {
      favorited: profile?.preferences?.favoriteIds?.toString(),
    }
    return filterState
  }, [profile])
  const itemsPerPage = 8

  const setQueryString = (page: number, filters = filterState) => {
    void router.push(
      `/account/favorites?page=${page}${encodeToFrontendFilterString(filters)}`,
      undefined,
      {
        shallow: true,
      }
    )
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState,
    OrderByFieldsEnum.mostRecentlyUpdated
  )

  const pageTitle = `${t("pageTitle.favorites")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader className="listings-title" title={t("pageTitle.favorites")} inverse={true} />
      {!filterState.favorited ? (
        <h3 className="max-w-5xl container mx-auto text-4xl text-primary-darker font-bold px-4 py-8">
          {t("errors.noFavorites")}
        </h3>
      ) : (
        <LoadingOverlay isLoading={listingsLoading}>
          <>
            {listingsLoading && (
              <div className="container max-w-3xl my-4 px-4 py-10 content-start mx-auto" />
            )}
            {!listingsLoading && !listingsError && listingsData?.meta.totalItems === 0 && (
              <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
                <header>
                  <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
                  <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
                </header>
              </div>
            )}
            {!listingsLoading && (
              <div>
                {listingsData?.meta.totalItems > 0 && getListings(listingsData?.items)}
                <AgPagination
                  totalItems={listingsData?.meta.totalItems}
                  totalPages={listingsData?.meta.totalPages}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  quantityLabel={t("listings.totalListings")}
                  setCurrentPage={setQueryString}
                  includeBorder={false}
                  matchListingCardWidth={true}
                />
              </div>
            )}
          </>
        </LoadingOverlay>
      )}
    </Layout>
  )
}

export default FavoritedListingsPage
