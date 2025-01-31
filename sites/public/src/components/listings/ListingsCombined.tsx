import React from "react"
import { APIProvider } from "@vis.gl/react-google-maps"
import { useJsApiLoader } from "@react-google-maps/api"
import { Listing, ListingMapMarker } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import CustomSiteFooter from "../shared/CustomSiteFooter"
import { ListingsMap, MapMarkerData } from "./ListingsMap"
import { ListingsList } from "./ListingsList"
import styles from "./ListingsCombined.module.scss"
import { ListingsSearchMetadata } from "./search/ListingsSearchMetadata"
import { ListingSearchParams } from "../../lib/listings/search"

type ListingsCombinedProps = {
  markers: ListingMapMarker[] | null
  onPageChange: (page: number) => void
  googleMapsApiKey: string
  googleMapsMapId: string
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterCount: number
  searchResults: {
    listings: Listing[]
    currentPage: number
    lastPage: number
    totalItems: number
  }
  listView: boolean
  setListView: React.Dispatch<React.SetStateAction<boolean>>
  setVisibleMarkers: React.Dispatch<React.SetStateAction<MapMarkerData[]>>
  visibleMarkers: MapMarkerData[]
  isDesktop: boolean
  loading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  searchFilter: ListingSearchParams
  isFirstBoundsLoad: boolean
  setIsFirstBoundsLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const ListingsCombined = (props: ListingsCombinedProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: props.googleMapsApiKey,
  })

  if (!isLoaded) return <></>

  const getListLoading = () => {
    if (!props.googleMapsApiKey || !props.googleMapsMapId || !props.loading) return false
    return true
  }

  const getListingsList = () => {
    return (
      <APIProvider apiKey={props.googleMapsApiKey}>
        <div className={styles["listings-combined"]}>
          <ListingsSearchMetadata
            loading={props.loading}
            setModalOpen={props.setModalOpen}
            filterCount={props.filterCount}
            searchResults={props.searchResults}
            setListView={props.setListView}
            listView={props.listView}
          />
          <div
            className={`${styles["listings-map-list-container"]} ${styles["listings-map-list-container-list-only"]}`}
          >
            <div id="listings-list-expanded" className={styles["listings-list-expanded"]}>
              <ListingsList
                listings={props.searchResults.listings}
                currentPage={props.searchResults.currentPage}
                lastPage={props.searchResults.lastPage}
                onPageChange={props.onPageChange}
                loading={getListLoading() || (props.isFirstBoundsLoad && props.isDesktop)}
                mapMarkers={props.markers}
              />
            </div>
            <div>
              <CustomSiteFooter />
            </div>
          </div>
        </div>
      </APIProvider>
    )
  }

  const getListingsMap = () => {
    return (
      <APIProvider apiKey={props.googleMapsApiKey}>
        <div className={styles["listings-combined"]}>
          <ListingsSearchMetadata
            loading={props.loading}
            setModalOpen={props.setModalOpen}
            filterCount={props.filterCount}
            searchResults={props.searchResults}
            setListView={props.setListView}
            listView={props.listView}
          />
          <div className={styles["listings-map-expanded"]}>
            <ListingsMap
              listings={props.markers}
              googleMapsApiKey={props.googleMapsApiKey}
              googleMapsMapId={props.googleMapsMapId}
              isMapExpanded={true}
              setVisibleMarkers={props.setVisibleMarkers}
              visibleMarkers={props.visibleMarkers}
              setIsLoading={props.setIsLoading}
              searchFilter={props.searchFilter}
              isFirstBoundsLoad={props.isFirstBoundsLoad}
              setIsFirstBoundsLoad={props.setIsFirstBoundsLoad}
              isDesktop={props.isDesktop}
            />
          </div>
        </div>
      </APIProvider>
    )
  }

  const getListingsCombined = () => {
    return (
      <APIProvider apiKey={props.googleMapsApiKey}>
        <div className={styles["listings-combined"]}>
          <ListingsSearchMetadata
            loading={props.loading}
            setModalOpen={props.setModalOpen}
            filterCount={props.filterCount}
            searchResults={props.searchResults}
            setListView={props.setListView}
            listView={props.listView}
          />
          <div className={styles["listings-map-list-container"]}>
            <div className={styles["listings-map"]}>
              <ListingsMap
                listings={props.markers}
                googleMapsApiKey={props.googleMapsApiKey}
                googleMapsMapId={props.googleMapsMapId}
                isMapExpanded={false}
                setVisibleMarkers={props.setVisibleMarkers}
                visibleMarkers={props.visibleMarkers}
                setIsLoading={props.setIsLoading}
                searchFilter={props.searchFilter}
                isFirstBoundsLoad={props.isFirstBoundsLoad}
                setIsFirstBoundsLoad={props.setIsFirstBoundsLoad}
                isDesktop={props.isDesktop}
              />
            </div>
            <div id="listings-outer-container" className={styles["listings-outer-container"]}>
              <div id="listings-list" className={styles["listings-list"]}>
                <ListingsList
                  listings={props.searchResults.listings}
                  currentPage={props.searchResults.currentPage}
                  lastPage={props.searchResults.lastPage}
                  loading={getListLoading() || (props.isFirstBoundsLoad && props.isDesktop)}
                  onPageChange={props.onPageChange}
                  mapMarkers={props.markers}
                />
                <CustomSiteFooter />
              </div>
            </div>
          </div>
        </div>
      </APIProvider>
    )
  }

  let div: JSX.Element

  if (!props.isDesktop && props.listView) {
    div = getListingsList()
  } else if (!props.isDesktop && !props.listView) {
    div = getListingsMap()
  } else if (props.isDesktop) {
    div = getListingsCombined()
  }

  return div
}

export { ListingsCombined as default, ListingsCombined }
