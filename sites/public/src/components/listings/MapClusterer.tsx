import React, { useCallback, useEffect, useMemo, useState, useContext } from "react"
import { InfoWindow, useMap } from "@vis.gl/react-google-maps"
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { MapMarkerData } from "./ListingsMap"
import { MapMarker } from "./MapMarker"
import styles from "./ListingsCombined.module.scss"
import { ListingViews } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getListingCard, getBoundsZoomLevel } from "../../lib/helpers"
import { ListingSearchParams } from "../../lib/listings/search"

export type ListingsMapMarkersProps = {
  mapMarkers: MapMarkerData[] | null
  infoWindowIndex: number
  setInfoWindowIndex: React.Dispatch<React.SetStateAction<number>>
  visibleMarkers: MapMarkerData[]
  setVisibleMarkers: React.Dispatch<React.SetStateAction<MapMarkerData[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  searchFilter: ListingSearchParams
  isFirstBoundsLoad: boolean
  setIsFirstBoundsLoad: React.Dispatch<React.SetStateAction<boolean>>
  isDesktop: boolean
}

export const fitBounds = (
  map: google.maps.Map,
  mapMarkers: MapMarkerData[],
  continueIfEmpty?: boolean,
  setIsFirstBoundsLoad?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const bounds = new window.google.maps.LatLngBounds()

  if (!map) return
  mapMarkers?.map((marker) => {
    bounds.extend({
      lat: marker.coordinate.lat,
      lng: marker.coordinate.lng,
    })
  })

  const visibleMarkers = mapMarkers?.filter((marker) =>
    map.getBounds()?.contains(marker.coordinate)
  )

  if (!continueIfEmpty && visibleMarkers.length === 0) {
    return
  } else {
    map.fitBounds(bounds, document.getElementById("listings-map").clientWidth * 0.05)
    if (mapMarkers.length === 1) {
      const zoomLevel = getBoundsZoomLevel(bounds)
      map.setZoom(zoomLevel - 7)
    }
  }
  if (setIsFirstBoundsLoad) {
    setIsFirstBoundsLoad(false)
  }
}

// Zoom in slowly by recursively setting the zoom level
const animateZoom = (
  map: google.maps.Map,
  targetZoom: number,
  panTo?: google.maps.LatLngLiteral
) => {
  const currentZoom = map.getZoom()
  if (currentZoom >= targetZoom) return
  if (currentZoom !== targetZoom) {
    google.maps.event.addListenerOnce(map, "zoom_changed", () => {
      animateZoom(map, targetZoom)
    })
    if (panTo) map.setCenter(panTo)
    setTimeout(function () {
      map.setZoom(currentZoom + 1)
    }, 80)
  }
}

const sortMarkers = (unsortedMarkers: MapMarkerData[]) => {
  return JSON.stringify(
    unsortedMarkers?.sort((a, b) => {
      if (a.coordinate.lat === b.coordinate.lat) return a.coordinate.lng - b.coordinate.lng
      return a.coordinate.lat - b.coordinate.lat
    })
  )
}

let delayTimer

export const MapClusterer = ({
  mapMarkers,
  infoWindowIndex,
  setInfoWindowIndex,
  setVisibleMarkers,
  setIsLoading,
  isFirstBoundsLoad,
  setIsFirstBoundsLoad,
  isDesktop,
}: ListingsMapMarkersProps) => {
  const { listingsService } = useContext(AuthContext)
  const [markers, setMarkers] = useState<{
    [key: string]: google.maps.marker.AdvancedMarkerElement
  }>({})
  const [infoWindowContent, setInfoWindowContent] = useState(null)
  const [currentMapMarkers, setCurrentMapMarkers] = useState(mapMarkers)

  const map = useMap()

  const resetVisibleMarkers = () => {
    const bounds = map.getBounds()
    const newVisibleMarkers = mapMarkers?.filter((marker) => bounds?.contains(marker.coordinate))
    // Wait to refetch again until the map has finished fitting bounds
    if (isFirstBoundsLoad && isDesktop) return mapMarkers

    setVisibleMarkers(newVisibleMarkers)
  }

  // Whenever the user's map navigation finishes, on a 1 second delay, reset the currently visible markers on the map to re-search the list
  map.addListener("idle", () => {
    setIsLoading(true)
    clearTimeout(delayTimer)
    delayTimer = setTimeout(resetVisibleMarkers, isFirstBoundsLoad ? 0 : 800)
  })

  map.addListener("click", () => {
    setInfoWindowIndex(null)
  })

  map.addListener("drag", () => {
    setInfoWindowIndex(null)
  })

  useEffect(() => {
    const oldMarkers = sortMarkers(currentMapMarkers)
    const newMarkers = sortMarkers(mapMarkers)

    if (oldMarkers !== newMarkers) {
      setCurrentMapMarkers(mapMarkers)
      resetVisibleMarkers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapMarkers, map])

  const fetchInfoWindow = async (listingId: string) => {
    try {
      const response = await listingsService.retrieve({
        id: listingId,
        view: ListingViews.base,
        combined: true,
      })
      setInfoWindowContent(
        <div data-testid={"listings-map-info-window"}>
          {getListingCard(response, infoWindowIndex)}
        </div>
      )
    } catch (e) {
      console.log("listingsService.retrieve error: ", e)
    }
  }

  const clusterer: MarkerClusterer = useMemo(() => {
    if (!map) return null

    return new MarkerClusterer({
      map,
      renderer: {
        render: (cluster) => {
          // Create the cluster icon styles
          const clusterMarker = document.createElement("div")
          clusterMarker.className = styles["cluster-icon"]
          clusterMarker.textContent = cluster.count.toString()
          const DEFAULT_REM = 2
          let calculatedSize = DEFAULT_REM + 0.03 * cluster.count
          if (calculatedSize > 3.5) calculatedSize = 3.5
          clusterMarker.style.width = `${calculatedSize}rem`
          clusterMarker.style.height = `${calculatedSize}rem`
          clusterMarker.setAttribute("data-testid", "map-cluster")
          clusterMarker.setAttribute("aria-collapsed", "true")

          return new google.maps.marker.AdvancedMarkerElement({
            map,
            position: cluster.position,
            content: clusterMarker,
            title: `${cluster.count} listings in this cluster`,
          })
        },
      },
      algorithm: new SuperClusterAlgorithm({ radius: 110 }),
      onClusterClick: (_, cluster, map) => {
        setInfoWindowIndex(null)
        const zoomLevel = getBoundsZoomLevel(cluster.bounds)
        animateZoom(map, zoomLevel - 1)
        map.panTo(cluster.bounds.getCenter())
        map.getDiv().focus()
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    if (!clusterer) return

    clusterer.clearMarkers()
    clusterer.addMarkers(Object.values(markers))

    if (!map) return

    // Only automatically size the map to fit all pins on first map load
    if (isFirstBoundsLoad === false) return

    fitBounds(map, mapMarkers, false, setIsFirstBoundsLoad)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterer, markers, currentMapMarkers, map])

  // Keeps track of the markers on the map, passed to each marker
  const setMarkerRef = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement | null, key: number) => {
      setMarkers((markers) => {
        if ((marker && markers[key]) || (!marker && !markers[key])) return markers

        if (marker) {
          return { ...markers, [key]: marker }
        } else {
          const { [key]: _, ...newMarkers } = markers

          return newMarkers
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleMarkerClick = useCallback(async (marker: MapMarkerData) => {
    await fetchInfoWindow(marker.id)
    setInfoWindowIndex(marker.key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {mapMarkers?.map((marker) => (
        <MapMarker
          key={marker.key}
          marker={marker}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {infoWindowIndex !== null && (
        <InfoWindow
          anchor={markers[infoWindowIndex]}
          onCloseClick={() => {
            setInfoWindowContent(null)
            setInfoWindowIndex(null)
          }}
          className={"info-window"}
          minWidth={250}
          maxWidth={500}
          disableAutoPan={false}
        >
          {infoWindowContent}
        </InfoWindow>
      )}
    </>
  )
}
