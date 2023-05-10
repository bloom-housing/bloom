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
    const lat = listing.buildingAddress.latitude
    const lng = listing.buildingAddress.longitude
    const uri = getListingUrl(listing)
    const label = (++index).toString()

    markers.push({ lat, lng, uri, label })
  })

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={9}>
      {markers.map((marker) => (
        <Marker
          position={{ lat: marker.lat, lng: marker.lng }}
          label={{
            text: marker.label,
            color: "var(--bloom-color-white)",
            fontFamily: "var(--bloom-font-sans)",
            fontWeight: "700",
            fontSize: "var(--bloom-font-size-2xs)",
          }}
          onClick={() => (window.location.href = marker.uri)}
          key={marker.label}
          icon={{
            url: "/images/map-pin.svg",
            labelOrigin: new google.maps.Point(14, 15),
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  )
}

export { ListingsMap as default, ListingsMap }
