import * as React from "react"
import { SidebarAddress } from "./SidebarAddress"
import { t } from "../../../helpers/translator"
import { Icon } from "../../../icons/Icon"
import { Listing } from "@bloom-housing/backend-core/types"
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
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("leasingAgent.contact")}</h4>

      <p className="text-xl">{listing.leasingAgentName}</p>
      <p className="text-gray-700">{listing.leasingAgentTitle}</p>

      <p className="mt-5">
        <a href={phoneNumber}>
          <Icon symbol="phone" size="medium" fill="#0077DA" /> {t("t.call")}{" "}
          {listing.leasingAgentPhone}
        </a>
      </p>
      <p className="text-sm text-gray-700">{t("leasingAgent.dueToHighCallVolume")}</p>

      <p className="my-5">
        <a href={`mailto:${listing.leasingAgentEmail}`}>
          <Icon symbol="mail" size="medium" fill="#0077DA" /> {t("t.email")}
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
