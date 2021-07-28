import React, { useState, useCallback, useEffect } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import MapGL, { Marker } from "react-map-gl"
const GeocodeService = require("@mapbox/mapbox-sdk/services/geocoding")

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

interface MapBoxFeature {
  center: number[] // Index 0: longitude, Index 1: latitude
}

interface MapboxApiResponseBody {
  features: MapBoxFeature[]
}

interface MapboxApiResponse {
  body: MapboxApiResponseBody
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
    // Don't send a Mapbox request on every address key press - delay slightly instead
    let timer = setTimeout(() => {
      if (!props.address?.latitude || !props.address?.longitude) {
        const geocodingClient = GeocodeService({
          accessToken: process.env.mapBoxToken || process.env.MAPBOX_TOKEN,
        })

        geocodingClient
          .forwardGeocode({
            query: `${props.address?.street}, ${props.address?.city}, ${props.address?.state}, ${props.address?.zipCode}`,
            limit: 1,
          })
          .send()
          .then((response: MapboxApiResponse) => {
            setMarker({
              latitude: response.body.features[0].center[1],
              longitude: response.body.features[0].center[0],
            })
            setViewport({
              ...viewport,
              latitude: response.body.features[0].center[1],
              longitude: response.body.features[0].center[0],
            })
          })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [props.address])

  const onMarkerDragEnd = useCallback((event) => {
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    })
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
