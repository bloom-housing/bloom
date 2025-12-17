import React, { useState, useCallback, useEffect, useMemo } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { Map as MapGL, Marker, MarkerDragEvent } from "@vis.gl/react-mapbox"
import { Heading } from "@bloom-housing/ui-seeds"
import { MultiLineAddress } from "./MultiLineAddress"
import { useIntersect } from "../../.."
import { Address } from "../../types/backend-swagger"
import styles from "./Map.module.scss"

export interface MapProps {
  address?: Omit<Address, "id" | "createdAt" | "updatedAt">
  listingName?: string
  enableCustomPinPositioning?: boolean
  setCustomMapPositionChosen?: (customMapPosition: boolean) => void
  setLatLong?: (latLong: LatitudeLongitude) => void
}

export interface LatitudeLongitude {
  latitude: number
  longitude: number
}

export interface Viewport {
  width: string | number
  height: string | number
  latitude?: number
  longitude?: number
  zoom: number
}

const isValidLatitude = (latitude: number) => {
  return latitude >= -90 && latitude <= 90
}

const isValidLongitude = (longitude: number) => {
  return longitude >= -180 && longitude <= 180
}

const Map = (props: MapProps) => {
  // Lazy load the map component only when it will become visible on screen
  const { setIntersectingElement, intersecting } = useIntersect({
    // `window` isn't set for SSR, so we'll use `global` instead—doesn't really
    // matter because the map won't ever get rendered in SSR anyway
    rootMargin: `${global.innerHeight || 0}px`,
  })
  const [hasIntersected, setHasIntersected] = useState(false)
  if (intersecting && !hasIntersected) setHasIntersected(true)

  const [marker, setMarker] = useState({
    latitude: props.address?.latitude,
    longitude: props.address?.longitude,
  })

  const viewport = useMemo(() => {
    return {
      latitude: marker.latitude,
      longitude: marker.longitude,
      zoom: 13,
    }
  }, [marker])

  useEffect(() => {
    setMarker({
      latitude: props.address?.latitude,
      longitude: props.address?.longitude,
    })
  }, [props.address?.latitude, props.address?.longitude, props.enableCustomPinPositioning])

  const { setLatLong, setCustomMapPositionChosen } = props

  const onMarkerDragEnd = useCallback(
    (event: MarkerDragEvent) => {
      if (setLatLong) {
        setLatLong({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
        })
      }
      if (setCustomMapPositionChosen) {
        setCustomMapPositionChosen(true)
      }
      setMarker({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      })
    },
    [setLatLong, setCustomMapPositionChosen, setMarker]
  )

  if (
    !props.address ||
    !props.address.latitude ||
    !props.address.longitude ||
    !viewport.latitude ||
    !viewport.longitude
  )
    return null

  return (
    <div className={styles["map"]} ref={setIntersectingElement}>
      <div id="map-address-popup" className={styles["map-address-popup"]}>
        {props.listingName && (
          <Heading priority={3} size="md" className={styles["map-listing-name"]}>
            {props.listingName}
          </Heading>
        )}
        <MultiLineAddress address={props.address} />
      </div>
      {(process.env.mapBoxToken || process.env.MAPBOX_TOKEN) && hasIntersected && (
        <MapGL
          mapboxAccessToken={process.env.mapBoxToken || process.env.MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          style={{ height: "400px" }}
          scrollZoom={false}
          initialViewState={viewport}
        >
          {marker.latitude &&
            marker.longitude &&
            isValidLatitude(marker.latitude) &&
            isValidLongitude(marker.longitude) && (
              <>
                {props.enableCustomPinPositioning ? (
                  <Marker
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    offset={[0, -20]}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  >
                    <div className={styles["map-pin"]}></div>
                  </Marker>
                ) : (
                  <Marker latitude={marker.latitude} longitude={marker.longitude} offset={[0, -20]}>
                    <div className={styles["map-pin"]}></div>
                  </Marker>
                )}
              </>
            )}
        </MapGL>
      )}
    </div>
  )
}
export { Map as default, Map }
