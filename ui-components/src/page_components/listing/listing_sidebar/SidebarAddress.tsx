import * as React from "react"
import ReactDOMServer from "react-dom/server"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { Address } from "@bloom-housing/backend-core/types"
import { OneLineAddress, MultiLineAddress } from "../../../helpers/address"
import { t } from "../../../helpers/translator"
import Markdown from "markdown-to-jsx"

export interface SidebarAddressProps {
  address?: Omit<Address, "id" | "createdAt" | "updatedAt">
  officeHours?: string
}

const SidebarAddress = (props: SidebarAddressProps) => {
  const { address, officeHours } = props
  let mainAddress = null
  let googleMapsHref = ""
  let hours = <></>

  if (address?.street) {
    const oneLineAddress = <OneLineAddress address={address} />
    mainAddress = <MultiLineAddress address={address} />

    googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)
  }

  if (officeHours) {
    hours = (
      <>
        <h3 className="text-caps-tiny ">{t("leasingAgent.officeHours")}</h3>
        <div className="text-gray-800 text-tiny markdown">
          <Markdown children={officeHours} options={{ disableParsingRawHTML: true }} />
        </div>
      </>
    )
  }

  return (
    <>
      {address?.street && (
        <>
          <p className="text-gray-700 mb-1">{mainAddress}</p>
          <p className="mb-4">
            <a href={googleMapsHref} className="inline-block pt-1" target="_blank">
              <Icon symbol="map" size="medium" fill={IconFillColors.primary} />{" "}
              {t("t.getDirections")}
            </a>
          </p>
        </>
      )}
      {hours}
    </>
  )
}

export { SidebarAddress as default, SidebarAddress }
