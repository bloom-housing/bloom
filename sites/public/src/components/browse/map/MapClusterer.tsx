import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react"
import { InfoWindow, useMap } from "@vis.gl/react-google-maps"
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer"
import { AuthContext } from "@bloom-housing/shared-helpers"
import debounce from "lodash/debounce"
import { MapMarkerData } from "./ListingsMap"
import { MapMarker } from "./MapMarker"
import styles from "./ListingsCombined.module.scss"
import { ListingViews } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getBoundsZoomLevel } from "../../../lib/helpers"
import { ListingSearchParams } from "../../../lib/listings/search"

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

export const MapClusterer = ({
  mapMarkers,
  infoWindowIndex,
  setInfoWindowIndex,
  visibleMarkers,
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

  // 1) Read latest marker state from refs inside callbacks to avoid stale values
  // 2) On map idle, only trigger search when visible marker IDs actually change
  // 3) Debounce interactions after initial load to reduce re-search while panning/zooming
  // 4) Skip marker re-search during the first desktop cycle

  // Keep mutable references to the latest values so debounced callbacks don't use stale values
  const mapRef = useRef(map)
  const mapMarkersRef = useRef(mapMarkers)
  const visibleMarkersRef = useRef(visibleMarkers)
  const isFirstBoundsLoadRef = useRef(isFirstBoundsLoad)
  const isDesktopRef = useRef(isDesktop)

  useEffect(() => {
    mapRef.current = map
    mapMarkersRef.current = mapMarkers
    visibleMarkersRef.current = visibleMarkers
    isFirstBoundsLoadRef.current = isFirstBoundsLoad
    isDesktopRef.current = isDesktop
  }, [isDesktop, isFirstBoundsLoad, map, mapMarkers, visibleMarkers])

  // Compare only marker ids to determine whether the visible result set changed - sorting keeps comparison stable
  const markerSetSignature = useCallback((markers: MapMarkerData[] | null | undefined) => {
    return JSON.stringify((markers ?? []).map((marker) => marker.id).sort())
  }, [])

  // Compute markers currently inside map bounds using the latest map + markers refs
  const getVisibleMarkersInBounds = useCallback(() => {
    const currentMap = mapRef.current
    if (!currentMap) return []

    const bounds = currentMap.getBounds()
    const currentMapMarkers = mapMarkersRef.current
    return currentMapMarkers?.filter((marker) => bounds?.contains(marker.coordinate)) ?? []
  }, [])

  // If the visible marker set is unchanged, skip updates.
  const hasVisibleMarkerChange = useCallback(() => {
    const nextVisibleMarkers = getVisibleMarkersInBounds()
    const nextSignature = markerSetSignature(nextVisibleMarkers)
    const currentSignature = markerSetSignature(visibleMarkersRef.current)

    return nextSignature !== currentSignature
  }, [getVisibleMarkersInBounds, markerSetSignature])

  const resetVisibleMarkers = useCallback(() => {
    const newVisibleMarkers = getVisibleMarkersInBounds()
    // During first desktop cycle, avoid triggering marker-driven search
    if (isFirstBoundsLoadRef.current && isDesktopRef.current) return

    // When the computed visible set is identical, do not retrigger loading
    const nextSignature = markerSetSignature(newVisibleMarkers)
    const currentSignature = markerSetSignature(visibleMarkersRef.current)
    if (nextSignature === currentSignature) return

    setVisibleMarkers(newVisibleMarkers)
  }, [getVisibleMarkersInBounds, markerSetSignature, setVisibleMarkers])

  const debouncedResetVisibleMarkers = useMemo(
    () => debounce(resetVisibleMarkers, 800),
    [resetVisibleMarkers]
  )

  useEffect(() => {
    if (!map) return

    // After pan/zoom settles, refresh visible markers
    // First load runs immediately, then later interactions are debounced
    const idleListener = map.addListener("idle", () => {
      console.log("idle listener")
      if (isFirstBoundsLoad) {
        resetVisibleMarkers()
        return
      }

      // Don't flash loading state for unchanged marker sets
      if (!hasVisibleMarkerChange()) {
        return
      }

      setIsLoading(true)
      debouncedResetVisibleMarkers()
    })

    const clickListener = map.addListener("click", () => {
      setInfoWindowIndex(null)
    })

    const dragListener = map.addListener("drag", () => {
      setInfoWindowIndex(null)
    })

    return () => {
      idleListener.remove()
      clickListener.remove()
      dragListener.remove()
      // Clear pending debounced work when dependencies change or component unmounts
      debouncedResetVisibleMarkers.cancel()
    }
  }, [
    debouncedResetVisibleMarkers,
    hasVisibleMarkerChange,
    isFirstBoundsLoad,
    map,
    resetVisibleMarkers,
    setInfoWindowIndex,
    setIsLoading,
  ])

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
      })
      setInfoWindowContent(
        <div data-testid={"listings-map-info-window"}>
          {/* {getListingCard(response, infoWindowIndex)} */}
          Listing card goes here for listing with name: {response.name}
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
          const newMarkers = { ...markers }
          delete newMarkers[key]

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
