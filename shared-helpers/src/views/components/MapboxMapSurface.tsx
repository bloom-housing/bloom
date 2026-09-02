import React, { useState, useCallback, useEffect, useMemo } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { Map as MapGL, Marker, MarkerDragEvent } from "@vis.gl/react-mapbox"
import { Heading } from "@bloom-housing/ui-seeds"
import { MultiLineAddress } from "./MultiLineAddress"
import { Address } from "../../types/backend-swagger"
import type { LatitudeLongitude } from "./Map"
import styles from "./Map.module.scss"

export interface MapboxMapSurfaceProps {
  address: Omit<Address, "id" | "createdAt" | "updatedAt">
  listingName?: string
  hasIntersected: boolean
  enableCustomPinPositioning?: boolean
  setCustomMapPositionChosen?: (customMapPosition: boolean) => void
  setLatLong?: (latLong: LatitudeLongitude) => void
}

const isValidLatitude = (latitude: number) => {
  return latitude >= -90 && latitude <= 90
}

const isValidLongitude = (longitude: number) => {
  return longitude >= -180 && longitude <= 180
}

const MapboxMapSurface = (props: MapboxMapSurfaceProps) => {
  const [marker, setMarker] = useState({
    latitude: props.address.latitude,
    longitude: props.address.longitude,
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
      latitude: props.address.latitude,
      longitude: props.address.longitude,
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

  const mapBoxToken = process.env.mapBoxToken || process.env.MAPBOX_TOKEN

  return (
    <>
      <div id="map-address-popup" className={styles["map-address-popup"]}>
        {props.listingName && (
          <Heading priority={3} size="md" className={styles["map-listing-name"]}>
            {props.listingName}
          </Heading>
        )}
        <MultiLineAddress address={props.address} />
      </div>
      {mapBoxToken && props.hasIntersected && (
        <MapGL
          mapboxAccessToken={mapBoxToken}
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
    </>
  )
}

export { MapboxMapSurface as default, MapboxMapSurface }
