import React, { useState } from "react"
import { FormOption, ListingsSearchForm } from "./ListingsSearchForm"
import { ListingSearchParams, generateSearchQuery } from "../../../lib/listings/search"
import { ListingService } from "../../../lib/listings/listing-service"
import { ListingsCombined } from "../ListingsCombined"

type ListingsSearchCombinedProps = {
  searchString?: string
  googleMapsApiKey: string
  listingsEndpoint: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  counties: FormOption[]
}

export function ListingsSearchCombined(props: ListingsSearchCombinedProps) {
  const [listings, setListings] = useState([])

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

    setListings(listings)
  }

  return (
    <div>
      <ListingsSearchForm
        searchString={props.searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={props.counties}
        onSubmit={onFormSubmit}
      />

      <ListingsCombined listings={listings} googleMapsApiKey={props.googleMapsApiKey} />
    </div>
  )
}
