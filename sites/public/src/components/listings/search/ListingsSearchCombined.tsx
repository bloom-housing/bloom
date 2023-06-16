import React, { useRef, useState, useEffect, useContext } from "react"
import { UserStatus } from "../../../lib/constants"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
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
function ListingsSearchCombined(props: ListingsSearchCombinedProps) {
  const { profile } = useContext(AuthContext)
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

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: searchResults.listings.length,
      listingIds: searchResults.listings.map((listing) => listing.id),
    })
  }, [profile, searchResults])

  // The search function expects a string
  // This can be changed later if needed
  const pageSize = "25"

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

// Input values/options below are passed into the form to make it easier to
// reuse it in multiple places. This may not ultimately be necessary, but it's
// easier to add it in at the beginning than it is to try to add make the change
// later.
const bedroomOptionsForLandingPage: FormOption[] = [
  {
    label: "Any",
    value: null,
  },
  {
    label: "Studio",
    value: "0",
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3+",
    value: "3",
  },
]

const bedroomOptions: FormOption[] = [
  {
    label: "Any",
    value: null,
  },
  {
    label: "Studio",
    value: "0",
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4+",
    value: "4",
  },
]

const bathroomOptions: FormOption[] = [
  {
    label: "Any",
    value: null,
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4+",
    value: "4",
  },
]

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
    labelNoteHTML: `(For San Francisco listings, please go to <a href="https://housing.sfgov.org/" target="_blank">DAHLIA</a>)`,
  },
]

export {
  ListingsSearchCombined as default,
  locations,
  bedroomOptions,
  bedroomOptionsForLandingPage,
  bathroomOptions,
}
