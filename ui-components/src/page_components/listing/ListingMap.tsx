import React, { useState, useCallback, useEffect, useMemo } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import MapGL, { Marker } from "react-map-gl"

import "./ListingMap.scss"
import {
  MultiLineAddress,
  Address,
} from "../../page_components/listing/listing_sidebar/MultiLineAddress"
import { useIntersect } from "../../.."

export interface ListingMapProps {
  address?: Address
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

const ListingMap = (props: ListingMapProps) => {
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

  const [viewport, setViewport] = useState({
    latitude: marker.latitude,
    longitude: marker.longitude,
    width: "100%",
    height: 400,
    zoom: 13,
  } as Viewport)

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    const newViewport = { ...viewport }
    newViewport.width = "100%"
    newViewport.height = 400
    setViewport(newViewport)
  }

  useEffect(() => {
    onViewportChange({
      ...viewport,
      latitude: props.address?.latitude,
      longitude: props.address?.longitude,
    })
    setMarker({
      latitude: props.address?.latitude,
      longitude: props.address?.longitude,
    })
  }, [props.address?.latitude, props.address?.longitude, props.enableCustomPinPositioning])

  const onMarkerDragEnd = useCallback((event) => {
    if (props.setLatLong) {
      props.setLatLong({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0],
      })
    }
    if (props.setCustomMapPositionChosen) {
      props.setCustomMapPositionChosen(true)
    }
    setMarker({
      latitude: event.lngLat[1],
      longitude: event.lngLat[0],
    })
  }, [])

  if (
    !props.address ||
    !props.address.latitude ||
    !props.address.longitude ||
    !viewport.latitude ||
    !viewport.longitude
  )
    return null

  return (
    <div className="listing-map" ref={setIntersectingElement}>
      <div className="addressPopup">
        {props.listingName && <h3 className="text-caps-tiny">{props.listingName}</h3>}
        <MultiLineAddress address={props.address} />
      </div>
      {(process.env.mapBoxToken || process.env.MAPBOX_TOKEN) && hasIntersected && (
        <MapGL
          mapboxApiAccessToken={process.env.mapBoxToken || process.env.MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          scrollZoom={false}
          onViewportChange={onViewportChange}
          {...viewport}
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
                    offsetTop={-20}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  >
                    <div className="pin"></div>
                  </Marker>
                ) : (
                  <Marker latitude={marker.latitude} longitude={marker.longitude} offsetTop={-20}>
                    <div className="pin"></div>
                  </Marker>
                )}
              </>
            )}
        </MapGL>
      )}
    </div>
  )
}
export { ListingMap as default, ListingMap }
