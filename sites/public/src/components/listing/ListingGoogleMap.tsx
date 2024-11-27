import React from "react"
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps"
import { useJsApiLoader } from "@react-google-maps/api"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type ListingGoogleMapProps = {
  listing: Listing
  googleMapsHref: string
  googleMapsApiKey: string
  googleMapsMapId: string
}

const containerStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "400px",
  position: "relative",
}

const ListingGoogleMap = (props: ListingGoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: props.googleMapsApiKey,
  })

  const listing = props.listing
  const latitudeLongitude = {
    lat: listing.listingsBuildingAddress.latitude,
    lng: listing.listingsBuildingAddress.longitude,
  }
  const marker = (
    <AdvancedMarker position={latitudeLongitude}>
      <span>
        <img src="/images/map-pin.svg" alt={"Listing pin"} />
      </span>
    </AdvancedMarker>
  )

  return isLoaded ? (
    <a href={props.googleMapsHref} target="_blank">
      <APIProvider apiKey={props.googleMapsApiKey}>
        <Map
          mapId={props.googleMapsMapId}
          style={containerStyle}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          clickableIcons={false}
          defaultZoom={14}
          defaultCenter={latitudeLongitude}
        >
          {marker}
        </Map>
      </APIProvider>
    </a>
  ) : (
    <></>
  )
}

export { ListingGoogleMap as default, ListingGoogleMap }
