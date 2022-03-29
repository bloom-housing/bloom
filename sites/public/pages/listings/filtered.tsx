import Head from "next/head"
import {
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  AppearanceStyleType,
  t,
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
  LoadingOverlay,
  ListingFilterState,
  FrontendListingFilterStateKeys,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import { MetaTags } from "../../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../../lib/hooks"
import { EnumListingFilterParamsStatus, OrderByFieldsEnum } from "@bloom-housing/backend-core/types"
import FilterForm from "../../src/forms/filters/FilterForm"
import { getListings } from "../../lib/helpers"
import FindRentalsForMeLink from "../../lib/FindRentalsForMeLink"

const FilteredListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<ListingFilterState>()
  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  function setQueryString(page: number, filters = filterState) {
    void router.push(
      `/listings/filtered?page=${page}${encodeToFrontendFilterString(filters)}`,
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
    router.query[FrontendListingFilterStateKeys.status] = EnumListingFilterParamsStatus.active
    setFilterState(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState,
    OrderByFieldsEnum.mostRecentlyUpdated
  )

  let numberOfFilters = 0
  if (filterState) {
    numberOfFilters = Object.keys(filterState).filter(
      (p) => p !== "$comparison" && p !== "includeNulls" && p !== "status"
    ).length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    if (filterState.minRent !== undefined && filterState.maxRent != undefined) {
      numberOfFilters -= 1
    }
  }

  const buttonTitle = numberOfFilters
    ? t("listingFilters.buttonTitleWithNumber", { number: numberOfFilters })
    : t("listingFilters.buttonTitle")

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const onSubmit = (data: ListingFilterState) => {
    if (data?.[FrontendListingFilterStateKeys.includeNulls] === false) {
      delete data[FrontendListingFilterStateKeys.includeNulls]
    }
    // hide status filter
    delete data[FrontendListingFilterStateKeys.status]
    setFilterModalVisible(false)
    setQueryString(/*page=*/ 1, data)
  }

  let rentalsFoundTitle: string
  if (listingsLoading) {
    rentalsFoundTitle = t("listingFilters.loading")
  } else {
    rentalsFoundTitle = t("listingFilters.rentalsFound", {
      smart_count: listingsData?.meta.totalItems,
    })
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
        <FilterForm onSubmit={onSubmit} filterState={filterState} />
      </Modal>
      <h3 className="max-w-5xl container mx-auto text-4xl text-primary-darker font-bold px-4 py-8">
        {rentalsFoundTitle}
      </h3>
      <div className="flex container content-center max-w-5xl px-4 mx-auto">
        {}
        <Button
          className="mr-5"
          size={AppearanceSizeType.normal}
          icon="filter"
          iconPlacement="left"
          iconSize="base"
          onClick={() => setFilterModalVisible(true)}
        >
          {buttonTitle}
        </Button>
        {numberOfFilters > 0 && (
          <Button
            className="mx-2"
            size={AppearanceSizeType.normal}
            styleType={AppearanceStyleType.secondary}
            // "Submit" the form with no params to trigger a reset.
            onClick={() => onSubmit({})}
            icon="close"
            iconPlacement="right"
          >
            {t("listingFilters.resetButton")}
          </Button>
        )}
      </div>
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
    </Layout>
  )
}

export default FilteredListingsPage
