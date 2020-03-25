import * as React from "react"
import SidebarAddress from "./SidebarAddress"
import t from "../../../helpers/translator"
import Icon from "../../../atoms/Icon"
import { Listing } from "@bloom-housing/core"
import { openDateState } from "../../../helpers/state"

interface LeasingAgentProps {
  listing: Listing
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const listing = props.listing

  if (openDateState(listing)) {
    return null
  }

  const phoneNumber = `tel:${listing.leasingAgentPhone.replace(/[-()]/g, "")}`

  return (
    <section className="border-b border-gray-400 py-3 my-2 md:py-5 md:my-0 md:px-5 mx-5 md:mx-0">
      <h4 className="text-caps-underline">{t("leasingAgent.contact")}</h4>

      <p className="text-xl">{listing.leasingAgentName}</p>
      <p className="text-gray-700">{listing.leasingAgentTitle}</p>

      <p className="mt-5">
        <a href={phoneNumber}>
          <Icon symbol="phone" size="medium" /> {t("label.call")} {listing.leasingAgentPhone}
        </a>
      </p>
      <p className="text-sm text-gray-700">{t("leasingAgent.dueToHighCallVolume")}</p>

      <p className="my-5">
        <a href={`mailto:${listing.leasingAgentEmail}`}>
          <Icon symbol="mail" size="medium" /> {t("label.email")}
        </a>
      </p>
      <SidebarAddress
        address={listing.leasingAgentAddress}
        officeHours={listing.leasingAgentOfficeHours}
      />
    </section>
  )
}

export { LeasingAgent as default, LeasingAgent }
