import React, { useRef, useState } from "react"
import { ListingSearchParams, generateSearchQuery } from "../../../lib/listings/search"
import { ListingService } from "../../../lib/listings/listing-service"
import { ListingsCombined } from "../ListingsCombined"
import {
  AppearanceBorderType,
  AppearanceSizeType,
  Button,
  t,
} from "@bloom-housing/doorway-ui-components"
import { FormOption, ListingsSearchModal } from "./ListingsSearchModal"

type ListingsSearchCombinedProps = {
  searchString?: string
  googleMapsApiKey: string
  listingsEndpoint: string
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
export function ListingsSearchCombined(props: ListingsSearchCombinedProps) {
  //const [listings, setListings] = useState([])
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
  })

  // The search function expects a string
  // This can be changed later if needed
  const pageSize = "10"

  const search = async (params: ListingSearchParams, page: number) => {
    const qb = generateSearchQuery(params)
    const listingService = new ListingService(props.listingsEndpoint)
    const result = await listingService.searchListings(qb, pageSize, page)

    const listings = result.items
    const meta = result.meta

    setSearchResults({
      listings: listings,
      currentPage: meta.currentPage,
      lastPage: meta.totalPages,
    })

    searchParams.current = params

    // Keeping this until pagination is implemented
    console.log(
      `Showing ${meta.itemCount} listings of ${meta.totalItems} total (page ${meta.currentPage} of ${meta.totalPages})`
    )
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
    <div>
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ flexGrow: 1 }}></div>
        <Button
          border={AppearanceBorderType.borderless}
          size={AppearanceSizeType.small}
          onClick={() => {
            setModalOpen(true)
          }}
        >
          {`${t("search.filters")} ${filterCount}`}
        </Button>
      </div>

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
        googleMapsApiKey={props.googleMapsApiKey}
        onPageChange={onPageChange}
      />
    </div>
  )
}
