import * as React from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { getListingUrl } from "../../lib/helpers"
import { Listing } from "@bloom-housing/backend-core"

type ListingsMapProps = {
  listings?: Listing[]
}

const containerStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  position: "relative",
}

const center = {
  lat: 37.579795,
  lng: -122.374118,
}

const ListingsMap = (props: ListingsMapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.googleMapsApiKey,
  })

  const markers = []
  let index = 0
  props.listings.forEach((listing: Listing) => {
    const label = (++index).toString()
    const uri = getListingUrl(listing)

    markers.push(
      <Marker
        position={{ lat: listing.buildingAddress.latitude, lng: listing.buildingAddress.longitude }}
        label={label}
        onClick={() => (window.location.href = uri)}
        key={label}
      ></Marker>
    )
  })

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
      {markers}
    </GoogleMap>
  ) : (
    <></>
  )
}

export { ListingsMap as default, ListingsMap }
