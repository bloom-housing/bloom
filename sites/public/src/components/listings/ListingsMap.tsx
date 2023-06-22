import React, { useEffect, useState } from "react"
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api"
import { getListingUrl, getListingCard } from "../../lib/helpers"
import { Listing } from "@bloom-housing/backend-core"
import styles from "./ListingsCombined.module.scss"
import { MapControl } from "../shared/MapControl"

type ListingsMapProps = {
  listings?: Listing[]
  googleMapsApiKey: string
  desktopMinWidth?: number
  isMapExpanded: boolean
  setShowListingsList?: React.Dispatch<React.SetStateAction<boolean>>
}

const containerStyle: React.CSSProperties = {
  display: "flex",
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
    googleMapsApiKey: props.googleMapsApiKey,
  })

  const [openInfoWindow, setOpenInfoWindow] = useState(false)
  const [infoWindowIndex, setInfoWindowIndex] = useState(null)

  const [isDesktop, setIsDesktop] = useState(true)

  const DESKTOP_MIN_WIDTH = props.desktopMinWidth || 767 // @screen md
  useEffect(() => {
    if (window.innerWidth > DESKTOP_MIN_WIDTH) {
      setIsDesktop(true)
    } else {
      setIsDesktop(false)
    }

    const updateMedia = () => {
      if (window.innerWidth > DESKTOP_MIN_WIDTH) {
        setIsDesktop(true)
      } else {
        setIsDesktop(false)
      }
    }
    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  }, [DESKTOP_MIN_WIDTH])

  const markers = []
  let index = 0
  props.listings.forEach((listing: Listing) => {
    const lat = listing.buildingAddress.latitude
    const lng = listing.buildingAddress.longitude
    const uri = getListingUrl(listing)
    const key = ++index

    // Create an info window that is associated to each marker and that contains the listing card
    // for that listing.
    const infoWindow = (
      <InfoWindow position={{ lat: lat, lng: lng }} onCloseClick={() => setOpenInfoWindow(false)}>
        {getListingCard(listing, key - 1)}
      </InfoWindow>
    )
    markers.push({ lat, lng, uri, key, infoWindow })
  })

  const mapRef = React.useRef(null)
  return isLoaded ? (
    <div className={styles["listings-map"]}>
      <MapControl mapRef={mapRef} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        options={{ disableDefaultUI: true }}
        ref={mapRef}
      >
        {markers.map((marker) => (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            label={{
              text: marker.key.toString(),
              color: "var(--bloom-color-white)",
              fontFamily: "var(--bloom-font-sans)",
              fontWeight: "700",
              fontSize: "var(--bloom-font-size-2xs)",
            }}
            onClick={() => {
              if (isDesktop) {
                setOpenInfoWindow(true)
                setInfoWindowIndex(marker.key)
              } else {
                if (props.isMapExpanded) {
                  // Bring up the listings list with the correct listing at the top. A short timeout
                  // is needed so the listings row element can be found in the document.
                  props.setShowListingsList(true)
                  setTimeout(() => {
                    const element = document.getElementsByClassName("listings-row")[marker.key - 1]
                    element.scrollIntoView(false)
                  }, 1)
                } else {
                  const element = document.getElementsByClassName("listings-row")[marker.key - 1]
                  element.scrollIntoView(false)
                }
              }
            }}
            key={marker.key.toString()}
            icon={{
              url: "/images/map-pin.svg",
              labelOrigin: new google.maps.Point(14, 15),
            }}
          >
            {/* Only display the info window when the corresponding marker has been clicked. */}
            {openInfoWindow && infoWindowIndex === marker.key && marker.infoWindow}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export { ListingsMap as default, ListingsMap }
