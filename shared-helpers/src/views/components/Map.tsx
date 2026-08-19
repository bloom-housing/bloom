import React, { useState } from "react"
import { MapboxMapSurface } from "./MapboxMapSurface"
import { GoogleMapSurface } from "./GoogleMapSurface"
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

const Map = (props: MapProps) => {
  // Lazy load the map component only when it will become visible on screen
  const { setIntersectingElement, intersecting } = useIntersect({
    // `window` isn't set for SSR, so we'll use `global` instead—doesn't really
    // matter because the map won't ever get rendered in SSR anyway
    rootMargin: `${global.innerHeight || 0}px`,
  })
  const [hasIntersected, setHasIntersected] = useState(false)
  if (intersecting && !hasIntersected) setHasIntersected(true)

  const { address } = props

  const googleMapsApiKey = process.env.googleMapsApiKey
  const googleMapsMapId = process.env.googleMapsMapId

  if (!address || !address.latitude || !address.longitude) return null

  if (!props.enableCustomPinPositioning && googleMapsApiKey && googleMapsMapId) {
    return (
      <div className={styles["map"]} ref={setIntersectingElement}>
        <GoogleMapSurface
          address={address}
          apiKey={googleMapsApiKey}
          mapId={googleMapsMapId}
          hasIntersected={hasIntersected}
        />
      </div>
    )
  }

  return (
    <div className={styles["map"]} ref={setIntersectingElement}>
      <MapboxMapSurface
        address={address}
        listingName={props.listingName}
        hasIntersected={hasIntersected}
        enableCustomPinPositioning={props.enableCustomPinPositioning}
        setCustomMapPositionChosen={props.setCustomMapPositionChosen}
        setLatLong={props.setLatLong}
      />
    </div>
  )
}
export { Map as default, Map }
