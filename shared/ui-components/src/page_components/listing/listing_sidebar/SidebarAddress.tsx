import * as React from "react"
import ReactDOMServer from "react-dom/server"
import Icon from "../../../atoms/Icon"
import { Address } from "@bloom-housing/core"
import { OneLineAddress, MultiLineAddress } from "../../../helpers/address"
import t from "../../../helpers/translator"

export interface SidebarAddressProps {
  address: Address
  officeHours?: string
}

const SidebarAddress = (props: SidebarAddressProps) => {
  const { address, officeHours } = props
  let mainAddress = null
  let googleMapsHref = ""
  let hours = <></>

  if (address.street) {
    const oneLineAddress = <OneLineAddress address={address} />
    mainAddress = <MultiLineAddress address={address} />

    googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)
  }

  if (officeHours) {
    hours = (
      <>
        <h3 className="text-caps-tiny ">{t("leasingAgent.officeHours")}</h3>
        <p className="text-gray-800">{officeHours}</p>
      </>
    )
  }

  return (
    <>
      {address.street && (
        <p className="text-gray-700 mb-4">
          {mainAddress}
          <br />
          <a href={googleMapsHref} target="_blank">
            <Icon symbol="map" size="medium" /> {t("label.getDirections")}
          </a>
        </p>
      )}
      {hours}
    </>
  )
}

export { SidebarAddress as default, SidebarAddress }
