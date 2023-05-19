import React, { useState } from "react"
import { ListingSearchParams, generateSearchQuery } from "../../../lib/listings/search"
import { ListingService } from "../../../lib/listings/listing-service"
import { ListingsCombined } from "../ListingsCombined"
import { AppearanceBorderType, AppearanceSizeType, Button, t } from "@bloom-housing/doorway-ui-components"
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
  const [listings, setListings] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)

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

      <ListingsCombined listings={listings} googleMapsApiKey={props.googleMapsApiKey} />
    </div>
  )
}
