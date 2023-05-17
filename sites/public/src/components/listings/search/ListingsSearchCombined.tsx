import React, { useState } from "react"
import { ListingSearchParams, generateSearchQuery } from "../../../lib/listings/search"
import { ListingService } from "../../../lib/listings/listing-service"
import { ListingsCombined } from "../ListingsCombined"
import { AppearanceBorderType, AppearanceSizeType, Button } from "@bloom-housing/ui-components"
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
  const [state, setState] = useState({
    modalOpen: false,
    listings: [],
    filterCount: 0,
  })

  const onFormSubmit = async (params: ListingSearchParams) => {
    const qb = generateSearchQuery(params)
    const listingService = new ListingService(props.listingsEndpoint)
    const result = await listingService.searchListings(qb)

    const listings = result.items
    const meta = result.meta

    // Keeping this until pagination is implemented
    console.log(
      `Showing ${meta.itemCount} listings of ${meta.totalItems} total (page ${meta.currentPage} of ${meta.totalPages})`
    )

    //setListings(listings)
    setState({
      modalOpen: false,
      listings: listings,
      filterCount: state.filterCount,
    })
  }

  const onModalClose = () => {
    setState({
      modalOpen: false,
      listings: state.listings,
      filterCount: state.filterCount,
    })
  }

  const updateFilterCount = (count: number) => {
    setState({
      modalOpen: state.modalOpen,
      listings: state.listings,
      filterCount: count,
    })
  }

  return (
    <div>
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ flexGrow: 1 }}></div>
        <Button
          border={AppearanceBorderType.borderless}
          size={AppearanceSizeType.small}
          onClick={() => {
            setState({
              modalOpen: true,
              listings: state.listings,
              filterCount: state.filterCount,
            })
          }}
        >
          {`Filters ${state.filterCount}`}
        </Button>
      </div>

      <ListingsSearchModal
        open={state.modalOpen}
        searchString={props.searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={props.counties}
        onSubmit={onFormSubmit}
        onClose={onModalClose}
        onFilterChange={updateFilterCount}
      />

      <ListingsCombined listings={state.listings} googleMapsApiKey={props.googleMapsApiKey} />
    </div>
  )
}
