import React from "react"
import { Map } from "@vis.gl/react-google-maps"
import { Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { ListingMapMarker } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { MapControl } from "./MapControl"
import { MapClusterer } from "./MapClusterer"
import { MapRecenter } from "./MapRecenter"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsCombined.module.scss"

// Map TODO: Make this configurable
const defaultCenter = {
  lat: 37.579795,
  lng: -122.374118,
}

const defaultZoom = 5

type ListingsMapProps = {
  desktopMinWidth?: number
}

export type MapMarkerData = {
  id: string
  key: number
  coordinate: google.maps.LatLngLiteral
}

const getMarkers = (listings: ListingMapMarker[]) => {
  const markers: MapMarkerData[] | null = []
  if (!listings) return null
  listings?.forEach((listing: ListingMapMarker, index) => {
    markers.push({
      coordinate: {
        lat: listing.lat,
        lng: listing.lng,
      },
      id: listing.id,
      key: index,
    })
  })
  return markers
}

const ListingsMap = (_props: ListingsMapProps) => {
  const {
    searchResults,
    googleMapsMapId,
    visibleMarkers,
    setVisibleMarkers,
    setIsLoading,
    isFirstBoundsLoad,
    setIsFirstBoundsLoad,
    isDesktop,
    isLoading,
    infoWindowIndex,
    setInfoWindowIndex,
  } = useListingsMapContext()

  const markers: MapMarkerData[] | null = getMarkers(searchResults.markers)

  return (
    <div id={"listings-map"} className={styles["listings-map"]}>
      <a className={styles["listings-map-skip-link"]} href={"#listingsList"}>
        {t("t.skipMapOfListings")}
      </a>
      <Heading className={"sr-only"} priority={2}>
        {t("t.listingsMap")}
      </Heading>
      <Map
        mapId={googleMapsMapId}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        clickableIcons={false}
      >
        <MapControl setInfoWindowIndex={setInfoWindowIndex} />

        <MapRecenter
          mapMarkers={searchResults.markers}
          visibleMapMarkers={visibleMarkers?.length}
          isLoading={isLoading}
        />
        <MapClusterer
          mapMarkers={markers}
          infoWindowIndex={infoWindowIndex}
          setInfoWindowIndex={setInfoWindowIndex}
          setVisibleMarkers={setVisibleMarkers}
          visibleMarkers={visibleMarkers}
          setIsLoading={setIsLoading}
          isFirstBoundsLoad={isFirstBoundsLoad}
          setIsFirstBoundsLoad={setIsFirstBoundsLoad}
          isDesktop={isDesktop}
        />
      </Map>
    </div>
  )
}

export { ListingsMap as default, ListingsMap }
