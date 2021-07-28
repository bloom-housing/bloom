import * as React from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGL, { Marker } from "react-map-gl"
import "./ListingMap.scss"
import { MultiLineAddress, Address } from "../../helpers/address"

export interface ListingMapProps {
  address?: Address
  listingName: string
}

export interface Viewport {
  width: string | number
  height: string | number
  latitude?: number
  longitude?: number
  zoom: number
}

const ListingMap = (props: ListingMapProps) => {
  const [viewport, setViewPort] = React.useState({
    latitude: props.address?.latitude,
    longitude: props.address?.longitude,
    width: "100%",
    height: 400,
    zoom: 13,
  } as Viewport)

  const onViewportChange = (viewport: Viewport) => {
    // width and height need to be set here to work properly with
    // the responsive wrappers
    viewport.width = "100%"
    viewport.height = 400
    setViewPort({ ...viewport })
  }

  if (!props.address || !props?.address.latitude || !props.address.longitude) return null

  return (
    <div className="listing-map">
      <div className="addressPopup">
        <h3 className="text-caps-tiny">{props.listingName}</h3>
        <MultiLineAddress address={props.address} />
      </div>
      <ReactMapGL
        mapboxApiAccessToken={process.env.mapBoxToken || process.env.MAPBOX_TOKEN}
        onViewportChange={onViewportChange}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        scrollZoom={false}
        {...viewport}
      >
        <Marker
          latitude={props.address.latitude}
          longitude={props.address.longitude}
          offsetTop={-20}
        >
          <div className="pin"></div>
        </Marker>
      </ReactMapGL>
    </div>
  )
}
export { ListingMap as default, ListingMap }
