import React, { useState, useEffect, useContext } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import {
  ListingSearchParams,
  generateSearchQuery,
  parseSearchString,
} from "../../../lib/listings/search"
import { UserStatus } from "../../../lib/constants"
import { searchListings, searchMapMarkers } from "../../../lib/listings/listing-service"
import styles from "./ListingsSearch.module.scss"
import { ListingsCombined } from "../ListingsCombined"
import { FormOption, ListingsSearchModal } from "./ListingsSearchModal"
import { MapMarkerData } from "../ListingsMap"

type ListingsSearchCombinedProps = {
  searchString?: string
  googleMapsApiKey: string
  googleMapsMapId: string
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
  const [listView, setListView] = useState<boolean>(true)
  const [visibleMarkers, setVisibleMarkers] = useState<MapMarkerData[]>(null)
  const [currentMarkers, setCurrentMarkers] = useState<MapMarkerData[]>(null)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstBoundsLoad, setIsFirstBoundsLoad] = useState<boolean>(true)

  const [searchFilter, setSearchFilter] = useState(
    parseSearchString(props.searchString, {
      bedrooms: null,
      bathrooms: null,
      minRent: "",
      monthlyRent: "",
      propertyName: "",
      counties: props.counties.map((county) => county.label),
      availability: null,
      ids: undefined,
    })
  )

  const [searchResults, setSearchResults] = useState({
    listings: [],
    markers: [],
    currentPage: 0,
    lastPage: 0,
    totalItems: 0,
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

  const map = useMap()

  const search = async (page: number, changingFilter?: boolean) => {
    // If a user pans over empty space, reset the listings to empty instead of refetching

    const oldMarkersSearch = JSON.stringify(
      currentMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )
    const newMarkersSearch = JSON.stringify(
      visibleMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )

    if (visibleMarkers?.length === 0 && !changingFilter) {
      setSearchResults({
        listings: [],
        markers: searchResults.markers,
        currentPage: 0,
        lastPage: 0,
        totalItems: 0,
      })
      setIsLoading(false)
      return
    }

    const modifiedParams: ListingSearchParams = {
      ...searchFilter,
      ids: visibleMarkers?.map((marker) => marker.id),
    }

    // Search the listings by both the filter & the visible markers - but search the markers by only the filter, so that you can scroll out of the currently searched view and still see the markers
    const listingIdsOnlyQb = generateSearchQuery(modifiedParams)
    const genericQb = generateSearchQuery(searchFilter)

    let newListings = null
    let newMeta

    // Don't search listings as you move the map if you're in mobile map view, otherwise update the list
    // Wait until markers have been fetched for the first time before searching listings for the first time
    // Don't search the listings if the filter is changing - first search the markers, which will update the listings
    if (
      (!isFirstBoundsLoad &&
        !!map &&
        oldMarkersSearch !== newMarkersSearch &&
        !changingFilter &&
        (isDesktop || listView) &&
        !(visibleMarkers?.length === 0 && changingFilter)) ||
      !isDesktop
    ) {
      setIsLoading(true)
      const result = await searchListings(
        isDesktop ? listingIdsOnlyQb : genericQb,
        pageSize,
        page,
        listingsService
      )
      newListings = result.items
      newMeta = result.meta
    }
    let newMarkers = null

    // Only search the markers if the filter is changing
    // Don't search markers again if the first fetch of markers is still loading inside the map (race condition)
    if (changingFilter && !(isFirstBoundsLoad && isDesktop && searchResults.markers.length)) {
      newMarkers = await searchMapMarkers(genericQb, listingsService)
      // If the filter from the homepage has zero results, don't fetch the listings
      if (isFirstBoundsLoad && newMarkers.length === 0) {
        newListings = []
        setIsLoading(false)
        setIsFirstBoundsLoad(false)
      }
    }

    setSearchResults({
      listings: newListings ?? searchResults.listings,
      markers: newMarkers ?? searchResults.markers,
      currentPage: newMeta ? newMeta.currentPage : searchResults.currentPage,
      lastPage: newMeta ? newMeta.totalPages : searchResults.lastPage,
      totalItems: newMeta ? newMeta.totalItems : searchResults.totalItems,
    })

    // On desktop, keep list loading set to true until map is finished with its first load
    if ((!isFirstBoundsLoad && newMarkersSearch !== undefined && !changingFilter) || !isDesktop) {
      setIsLoading(false)
    }

    document.getElementById("listings-outer-container")?.scrollTo(0, 0)
    document.getElementById("listings-list")?.scrollTo(0, 0)
    document.getElementById("listings-list-expanded")?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }

  const DESKTOP_MIN_WIDTH = 767 // @screen md
  useEffect(() => {
    if (window.innerWidth > DESKTOP_MIN_WIDTH) {
      setIsDesktop(true)
    } else {
      setIsDesktop(false)
    }

    const updateMedia = () => {
      if (window.innerWidth > DESKTOP_MIN_WIDTH) {
        setIsDesktop(true)
      } else {
        setIsDesktop(false)
      }
    }
    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  }, [])

  // Re-search when the filter is updated
  useEffect(() => {
    async function searchListings() {
      await search(1, true)
    }
    void searchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter])

  // Re-search when entering mobile
  useEffect(() => {
    async function searchListings() {
      await search(1, true)
    }
    if (!isDesktop) {
      void searchListings()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  // Re-set the view when entering the map on mobile to fit bounds
  useEffect(() => {
    if (!listView) setIsFirstBoundsLoad(true)
  }, [listView])

  // Re-search when the map's visible markers are changed
  useEffect(() => {
    async function searchListings() {
      await search(1)
    }

    const oldMarkers = JSON.stringify(
      currentMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )
    const newMarkers = JSON.stringify(
      visibleMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )

    // Only re-search if the visible markers are not the same
    if (oldMarkers !== newMarkers && isDesktop) {
      setCurrentMarkers(visibleMarkers)
      void searchListings()
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMarkers])

  // Search the listings once the map has been loaded for the first time
  useEffect(() => {
    async function searchListings() {
      await search(1)
    }

    if (!isFirstBoundsLoad && searchResults.listings.length === 0) {
      void searchListings()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstBoundsLoad])

  const onFormSubmit = (params: ListingSearchParams) => {
    setIsLoading(true)
    setSearchFilter(params)
  }

  const onPageChange = async (page: number) => {
    await search(page)
  }

  const onModalClose = () => {
    setModalOpen(false)
  }

  const updateFilterCount = (count: number) => {
    setFilterCount(count)
  }

  return (
    <div className={styles["listings-vars"]}>
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
        markers={searchResults.markers}
        googleMapsApiKey={props.googleMapsApiKey}
        googleMapsMapId={props.googleMapsMapId}
        onPageChange={onPageChange}
        listView={listView}
        setModalOpen={setModalOpen}
        filterCount={filterCount}
        searchResults={searchResults}
        setListView={setListView}
        setVisibleMarkers={setVisibleMarkers}
        visibleMarkers={visibleMarkers}
        isDesktop={isDesktop}
        loading={isLoading}
        setIsLoading={setIsLoading}
        searchFilter={searchFilter}
        isFirstBoundsLoad={isFirstBoundsLoad}
        setIsFirstBoundsLoad={setIsFirstBoundsLoad}
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
