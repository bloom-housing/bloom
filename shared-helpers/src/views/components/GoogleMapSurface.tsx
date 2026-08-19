import React from "react"
import { APIProvider, Map as GoogleMap, AdvancedMarker } from "@vis.gl/react-google-maps"
import { Address } from "../../types/backend-swagger"

export interface GoogleMapSurfaceProps {
  address: Omit<Address, "id" | "createdAt" | "updatedAt">
  apiKey: string
  mapId: string
  hasIntersected: boolean
}

const containerStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "400px",
  position: "relative",
}

const GoogleMapSurface = (props: GoogleMapSurfaceProps) => {
  if (!props.hasIntersected) return null

  const latitudeLongitude = {
    lat: props.address.latitude,
    lng: props.address.longitude,
  }

  return (
    <APIProvider apiKey={props.apiKey}>
      <GoogleMap
        mapId={props.mapId}
        style={containerStyle}
        gestureHandling="greedy"
        disableDefaultUI={true}
        clickableIcons={false}
        defaultZoom={14}
        defaultCenter={latitudeLongitude}
      >
        <AdvancedMarker position={latitudeLongitude}>
          <span>
            <img src="/images/map-pin.svg" alt="Listing pin" />
          </span>
        </AdvancedMarker>
      </GoogleMap>
    </APIProvider>
  )
}

export { GoogleMapSurface as default, GoogleMapSurface }
