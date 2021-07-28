import React, { useState, useCallback, useEffect } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import MapGL, { Marker } from "react-map-gl"

import "./ListingMap.scss"
import { MultiLineAddress, Address } from "../../helpers/address"

export interface ListingMapProps {
  address?: Address
  listingName?: string
  customPinPositioning?: boolean
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

const ListingMap = (props: ListingMapProps) => {
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
  }, [props.address?.latitude, props.address?.longitude])

  const onMarkerDragEnd = useCallback((event) => {
    if (props.customPinPositioning) {
      if (props.setLatLong) {
        console.log("setting LAT LONG")
        props.setLatLong({
          latitude: event.lngLat[1],
          longitude: event.lngLat[0],
        })
      }
      setMarker({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0],
      })
    }
  }, [])

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    const newViewport = { ...viewport }
    newViewport.width = "100%"
    newViewport.height = 400
    setViewport(newViewport)
  }

  if (!props.address || !viewport.latitude || !viewport.longitude) return null

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
            onDragEnd={onMarkerDragEnd}
          >
            <div className="pin"></div>
          </Marker>
        ) : (
          <Marker latitude={marker.latitude ?? 0} longitude={marker.longitude ?? 0} offsetTop={-20}>
            <div className="pin"></div>
          </Marker>
        )}
      </MapGL>
    </div>
  )
}
export { ListingMap as default, ListingMap }
