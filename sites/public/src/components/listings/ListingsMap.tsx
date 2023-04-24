import * as React from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { ListingWithSourceMetadata } from "../../../types/ListingWithSourceMetadata"

type ListingsMapProps = {
  listings?: ListingWithSourceMetadata[]
}

const containerStyle = {
  display: "block",
  width: "100%",
  height: "300px",
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
  props.listings.forEach((listing) => {
    const label = (++index).toString()
    let uri: string
    if (listing.isBloomListing) {
      uri = `/listing/ext/${listing.id}`
    } else {
      uri = `/listing/${listing.id}/${listing.urlSlug}`
    }

    markers.push(
      <Marker
        position={{ lat: listing.buildingAddress.latitude, lng: listing.buildingAddress.longitude }}
        label={label}
        onClick={() => (window.location.href = uri)}
      ></Marker>
    )
  })

  return isLoaded ? (
    <section>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
        {markers}
      </GoogleMap>
    </section>
  ) : (
    <></>
  )
}

export { ListingsMap as default, ListingsMap }
