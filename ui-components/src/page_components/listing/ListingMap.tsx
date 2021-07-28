import React, { useState, useCallback } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import MapGL, { Marker } from "react-map-gl"

import "./ListingMap.scss"
import { MultiLineAddress, Address } from "../../helpers/address"

export interface ListingMapProps {
  address?: Address
  listingName?: string
  customPinPositioning?: boolean
}

export interface Viewport {
  width: string | number
  height: string | number
  latitude?: number
  longitude?: number
  zoom: number
}

const ListingMap = (props: ListingMapProps) => {
  const [viewport, setViewport] = useState({
    latitude: props.address?.latitude,
    longitude: props.address?.longitude,
    width: "100%",
    height: 400,
    zoom: 13,
  } as Viewport)

  const [marker, setMarker] = useState({
    latitude: props.address?.latitude,
    longitude: props.address?.longitude,
  })

  const [events, logEvents] = useState({})

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }))
  }, [])

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }))
  }, [])

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }))
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    })
  }, [])

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    viewport.width = "100%"
    viewport.height = 400
    setViewport({ ...viewport })
  }

  if (!props.address || !props?.address.latitude || !props.address.longitude) return null

  return (
    <div className="listing-map">
      <div className="addressPopup">
        {props.listingName && <h3 className="text-caps-tiny">{props.listingName}</h3>}
        <MultiLineAddress address={props.address} />
      </div>
      <MapGL
        mapboxApiAccessToken={process.env.mapBoxToken || process.env.MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        scrollZoom={false}
        onViewportChange={onViewportChange}
        {...viewport}
      >
        {props.customPinPositioning ? (
          <Marker
            latitude={marker.latitude ?? 0}
            longitude={marker.longitude ?? 0}
            offsetTop={-20}
            draggable={true}
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          >
            <div className="pin"></div>
          </Marker>
        ) : (
          <Marker
            latitude={props.address.latitude}
            longitude={props.address.longitude}
            offsetTop={-20}
          >
            <div className="pin"></div>
          </Marker>
        )}
      </MapGL>
    </div>
  )
}
export { ListingMap as default, ListingMap }
