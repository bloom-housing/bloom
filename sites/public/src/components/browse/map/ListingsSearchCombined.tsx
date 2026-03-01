import React, { useState, useEffect, useContext, useRef } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { ListingList, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import {
  FormOption,
  ListingSearchParams,
  generateSearchQuery,
  parseSearchString,
} from "../../../lib/listings/search"
import { UserStatus } from "../../../lib/constants"
import styles from "./ListingsSearch.module.scss"
import { ListingsCombined } from "./ListingsCombined"
import { MapMarkerData } from "./ListingsMap"
import { searchListings, searchMapMarkers } from "../../../lib/hooks"
import {
  FeatureFlagEnum,
  ListingFeaturesConfiguration,
  ListingViews,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FilterDrawer } from "../FilterDrawer"
import { encodeFilterDataToBackendFilters, FilterData } from "../FilterDrawerHelpers"

type ListingsSearchCombinedProps = {
  searchString?: string
  jurisdictionIds?: string[]
  googleMapsApiKey: string
  googleMapsMapId: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  jurisdictions: FormOption[]
  activeFeatureFlags?: FeatureFlagEnum[]
  multiselectData: MultiselectQuestion[]
  regions?: string[]
  listingFeaturesConfiguration?: ListingFeaturesConfiguration
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [drawerFilters, setDrawerFilters] = useState([])
  const [filterState, setFilterState] = useState<FilterData>({})
  const [listView, setListView] = useState<boolean>(true)
  const [visibleMarkers, setVisibleMarkers] = useState<MapMarkerData[]>(null)
  const [currentMarkers, setCurrentMarkers] = useState<MapMarkerData[]>(null)
  const [isDesktop, setIsDesktop] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstBoundsLoad, setIsFirstBoundsLoad] = useState<boolean>(true)
  const hasCompletedInitialListingsCallRef = useRef(false)
  const listingsVarsRef = useRef<HTMLDivElement>(null)

  const [searchFilter] = useState(
    parseSearchString(props.searchString, {
      bedrooms: null,
      bathrooms: null,
      minRent: "",
      monthlyRent: "",
      propertyName: "",
      jurisdictions: props.jurisdictions.map((county) => county.label),
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

  useEffect(() => {
    const listingsVarsElement = listingsVarsRef.current
    if (!listingsVarsElement) return

    const mainNavigation = document.querySelector('nav[aria-label="Main"]')
    const siteHeader = mainNavigation?.closest("header")

    const updateHeaderOffsets = () => {
      const topOffset = Math.max(0, Math.round(listingsVarsElement.getBoundingClientRect().top))
      const cssOffsetValue = `${topOffset}px`

      listingsVarsElement.style.setProperty("--desktop-header-offset", cssOffsetValue)
      listingsVarsElement.style.setProperty("--mobile-header-offset", cssOffsetValue)
    }

    updateHeaderOffsets()
    window.addEventListener("resize", updateHeaderOffsets)

    const resizeObserver = new ResizeObserver(updateHeaderOffsets)
    resizeObserver.observe(listingsVarsElement)

    if (siteHeader) {
      resizeObserver.observe(siteHeader)
    }

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateHeaderOffsets)
    }
  }, [])

  const search = async (page: number, changingFilter?: boolean) => {
    // If a user pans over empty space, reset the listings to empty instead of refetching
    if (isDesktop === undefined) return
    const oldMarkersSearch = JSON.stringify(
      currentMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )
    const newMarkersSearch = JSON.stringify(
      visibleMarkers?.sort((a, b) => a.coordinate.lat - b.coordinate.lat)
    )

    if (visibleMarkers?.length === 0 && !changingFilter) {
      if (!hasCompletedInitialListingsCallRef.current) {
        return
      }

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
      // Mobile view doesn't rely on the map
      !isDesktop ||
      // A page change should still fetch listings as the map markers won't change
      (searchResults.currentPage !== 0 && page !== searchResults.currentPage) ||
      (!isFirstBoundsLoad &&
        !!map &&
        oldMarkersSearch !== newMarkersSearch &&
        !changingFilter &&
        (isDesktop || listView) &&
        !(visibleMarkers?.length === 0 && changingFilter))
    ) {
      console.log("pre search loading true")
      setIsLoading(true)
      const result = await searchListings(
        isDesktop ? listingIdsOnlyQb : genericQb,
        pageSize,
        page,
        listingsService,
        ListingViews.map,
        props.jurisdictionIds,
        drawerFilters
      )
      hasCompletedInitialListingsCallRef.current = true
      newListings = result.items
      newMeta = result.meta
    }
    let newMarkers = null

    // Only search the markers if the filter is changing
    // Don't search markers again if the first fetch of markers is still loading inside the map (race condition)
    if (changingFilter && !(isFirstBoundsLoad && isDesktop && searchResults.markers.length)) {
      newMarkers = await searchMapMarkers(
        genericQb,
        listingsService,
        props.jurisdictionIds,
        drawerFilters
      )
      // If the filter from the homepage has zero results, don't fetch the listings
      if (isFirstBoundsLoad && newMarkers.length === 0) {
        newListings = []
        setIsLoading(false)
        setIsFirstBoundsLoad(false)
      }

      // If the filter change resulted in the same markers, set loading to false
      const oldMarkers = JSON.stringify(searchResults.markers?.sort((a, b) => a.lat - b.lat))
      const updatedMarkers = JSON.stringify(newMarkers?.sort((a, b) => a.lat - b.lat))
      if (oldMarkers === updatedMarkers) {
        setIsLoading(false)
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

    void searchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  // Map TODO - This was added, make sure it doesn't have side effects
  useEffect(() => {
    async function searchListings() {
      await search(1, true)
    }

    void searchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerFilters])

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
      console.log("old not equal to new")
      setCurrentMarkers(visibleMarkers)
      void searchListings()
    } else {
      if (hasCompletedInitialListingsCallRef.current) {
        setIsLoading(false)
      }
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

  const onPageChange = async (page: number) => {
    await search(page)
  }

  const onDrawerClose = () => {
    setIsFilterDrawerOpen(false)
  }

  const onDrawerSubmit = (data: FilterData) => {
    const backendFilters = encodeFilterDataToBackendFilters(data).filter(
      (filter) => filter.name !== ""
    )
    setFilterState(data)
    setDrawerFilters(backendFilters)
    setFilterCount(backendFilters.length)
    setIsFilterDrawerOpen(false)
  }

  const onDrawerClear = (resetFilters: (data: FilterData) => void) => {
    resetFilters({ name: "", monthlyRent: { minRent: "", maxRent: "" } })
    setFilterState({})
    setDrawerFilters([])
    setFilterCount(0)
    setIsFilterDrawerOpen(false)
  }

  return (
    <div className={styles["listings-vars"]} ref={listingsVarsRef}>
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={onDrawerClose}
        onSubmit={onDrawerSubmit}
        onClear={onDrawerClear}
        filterState={filterState}
        multiselectData={props.multiselectData}
        activeFeatureFlags={props.activeFeatureFlags}
        regions={props.regions}
        listingFeaturesConfiguration={props.listingFeaturesConfiguration}
      />

      <ListingsCombined
        markers={searchResults.markers}
        googleMapsApiKey={props.googleMapsApiKey}
        googleMapsMapId={props.googleMapsMapId}
        onPageChange={onPageChange}
        listView={listView}
        setFilterDrawerOpen={setIsFilterDrawerOpen}
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
