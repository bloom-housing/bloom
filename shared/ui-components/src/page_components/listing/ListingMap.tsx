import * as React from "react"
import ReactMapGL, { Marker } from "react-map-gl"
import { Address } from "@bloom/core/src/general"
import "./ListingMap.scss"
import { MultiLineAddress } from "../../helpers/address"
import { Listing } from "@bloom/core/src/listings"
interface ListingMapProps {
  address: Address
  listing: Listing
}

const ListingMap = (props: ListingMapProps) => {
  const address = props.address
  const [viewport, setViewPort] = React.useState({
    width: "100%",
    height: 400,
    latitude: address.latitude,
    longitude: address.longitude,
    zoom: 8
  })
  const _onViewportChange = viewport => setViewPort({ ...viewport })

  return (
    <>
      <div className="addressPopup">
        <h3 className="text-caps-tiny">{props.listing.name}</h3>
        <MultiLineAddress address={address} />
      </div>
      <ReactMapGL
        mapboxApiAccessToken={process.env.mapBoxToken}
        onViewportChange={_onViewportChange}
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
    </>
  )
}
export default ListingMap
