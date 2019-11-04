import * as React from "react"
import ReactDOMServer from "react-dom/server"
import { Address } from "@bloom-housing/core/src/general"
import { OneLineAddress, MultiLineAddress } from "../../../helpers/address"

interface SidebarAddressProps {
  address: Address
  officeHours?: string
}

const SidebarAddress = (props: SidebarAddressProps) => {
  const { address, officeHours } = props
  let mainAddress = null
  let googleMapsHref = ""
  let hours = <></>

  if (address.streetAddress) {
    const oneLineAddress = <OneLineAddress address={address} />
    mainAddress = <MultiLineAddress address={address} />

    googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)
  }

  if (officeHours) {
    hours = (
      <>
        <h3 className="text-caps-tiny ">Office Hours</h3>
        <p className="text-gray-800">{officeHours}</p>
      </>
    )
  }

  return (
    <>
      {address.streetAddress && (
        <p className="text-gray-700 mb-4">
          {mainAddress}
          <br />
          <a href={googleMapsHref} target="_blank">
            Get Directions
          </a>
        </p>
      )}
      {hours}
    </>
  )
}

export default SidebarAddress
