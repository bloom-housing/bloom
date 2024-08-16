import React, { useRef, useState, useEffect, useContext } from "react"
import { UserStatus } from "../../../lib/constants"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { ListingSearchParams, generateSearchQuery } from "../../../lib/listings/search"
import { searchListings } from "../../../lib/listings/listing-service"
import styles from "./ListingsSearch.module.scss"
import { ListingsCombined } from "../ListingsCombined"
import { FormOption, ListingsSearchModal } from "./ListingsSearchModal"
import { ListingsSearchMetadata } from "./ListingsSearchMetadata"

type ListingsSearchCombinedProps = {
  searchString?: string
  googleMapsApiKey: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  counties: FormOption[]
}

/**
 * This combines the search form with the listings map/list. Listings are updated
 * in both when the search form is submitted.
 *
 * @param props
 * @returns
 */
function ListingsSearchCombined(props: ListingsSearchCombinedProps) {
  const { profile, listingsService } = useContext(AuthContext)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)

  // Store the current search params for pagination
  const searchParams = useRef({
    bedrooms: null,
    bathrooms: null,
    monthlyRent: null,
    counties: [],
  } as ListingSearchParams)

  const [searchResults, setSearchResults] = useState({
    listings: [],
    currentPage: 0,
    lastPage: 0,
    totalItems: 0,
    loading: true,
  })

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: t("nav.siteTitle"),
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: searchResults.listings.length,
      listingIds: searchResults.listings.map((listing) => listing.id),
    })
  }, [profile, searchResults])

  // The search function expects a string
  // This can be changed later if needed
  const pageSize = 25

  const search = async (params: ListingSearchParams, page: number) => {
    const qb = generateSearchQuery(params)
    const result = await searchListings(qb, pageSize, page, listingsService)

    const listings = result.items
    const meta = result.meta

    setSearchResults({
      listings: listings,
      currentPage: meta.currentPage,
      lastPage: meta.totalPages,
      totalItems: meta.totalItems,
      loading: false,
    })

    searchParams.current = params

    document.getElementById("listings-outer-container")?.scrollTo(0, 0)
    document.getElementById("listings-list")?.scrollTo(0, 0)
    document.getElementById("listings-list-expanded")?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }

  const onFormSubmit = async (params: ListingSearchParams) => {
    await search(params, 1)
  }

  const onPageChange = async (page: number) => {
    await search(searchParams.current, page)
  }

  const onModalClose = () => {
    setModalOpen(false)
  }

  const updateFilterCount = (count: number) => {
    setFilterCount(count)
  }

  return (
    <div className={styles["listings-vars"]}>
      <ListingsSearchMetadata
        loading={searchResults.loading}
        setModalOpen={setModalOpen}
        filterCount={filterCount}
        searchResults={searchResults}
      />

      <ListingsSearchModal
        open={modalOpen}
        searchString={props.searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={props.counties}
        onSubmit={onFormSubmit}
        onClose={onModalClose}
        onFilterChange={updateFilterCount}
      />

      <ListingsCombined
        listings={searchResults.listings}
        currentPage={searchResults.currentPage}
        lastPage={searchResults.lastPage}
        loading={searchResults.loading}
        googleMapsApiKey={props.googleMapsApiKey}
        onPageChange={onPageChange}
      />
    </div>
  )
}

const locations: FormOption[] = [
  {
    label: "Alameda",
    value: "Alameda",
  },
  {
    label: "Contra Costa",
    value: "Contra Costa",
  },
  {
    label: "Marin",
    value: "Marin",
  },
  {
    label: "Napa",
    value: "Napa",
  },
  {
    label: "San Mateo",
    value: "San Mateo",
  },
  {
    label: "Santa Clara",
    value: "Santa Clara",
  },
  {
    label: "Solano",
    value: "Solano",
  },
  {
    label: "Sonoma",
    value: "Sonoma",
  },
  {
    label: "San Francisco",
    value: "San Francisco",
    isDisabled: true,
    doubleColumn: true,
  },
]

export { ListingsSearchCombined as default, locations }
