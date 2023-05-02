import React from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Listing } from "@bloom-housing/backend-core/types"

type ListingGoogleMapProps = {
  listing: Listing
  googleMapsHref: string
}

const containerStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "400px",
  position: "relative",
}

const ListingGoogleMap = (props: ListingGoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.googleMapsApiKey,
  })

  const listing = props.listing
  const latitudeLongitude = {
    lat: listing.buildingAddress.latitude,
    lng: listing.buildingAddress.longitude,
  }
  const marker = <Marker position={latitudeLongitude}></Marker>

  return isLoaded ? (
    <a href={props.googleMapsHref} target="_blank">
      <GoogleMap mapContainerStyle={containerStyle} center={latitudeLongitude} zoom={13}>
        {marker}
      </GoogleMap>
    </a>
  ) : (
    <></>
  )
}

export { ListingGoogleMap as default, ListingGoogleMap }
