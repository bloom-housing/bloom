import * as React from "react"
import ReactDOMServer from "react-dom/server"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { MultiLineAddress, Address } from "./MultiLineAddress"
import { OneLineAddress } from "./OneLineAddress"

export interface AddressProps {
  address?: Address
  mapString?: string
}

const ContactAddress = ({ address, mapString }: AddressProps) => {
  if (!address?.street) return null

  const oneLineAddress = <OneLineAddress address={address} />
  const mainAddress = <MultiLineAddress address={address} />
  const googleMapsHref =
    "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

  return (
    <>
      <p className="text-gray-700 mb-1">{mainAddress}</p>
      <p className="mb-4">
        <a
          href={googleMapsHref}
          className="inline-block pt-1"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon symbol="map" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
          {mapString && mapString}
        </a>
      </p>
    </>
  )
}

export { ContactAddress as default, ContactAddress }
