import * as React from "react"
import { SidebarAddress } from "./SidebarAddress"
import { t } from "../../../helpers/translator"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { Listing } from "@bloom-housing/backend-core/types"

interface LeasingAgentProps {
  listing: Listing
  managementCompany?: { name: string; website: string }
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const listing = props.listing

  const phoneNumber = listing.leasingAgentPhone
    ? `tel:${listing.leasingAgentPhone.replace(/[-()]/g, "")}`
    : ""

  let managementWebsite = props.managementCompany?.website
  if (managementWebsite && !managementWebsite.startsWith("http")) {
    managementWebsite = `http://${managementWebsite}`
  }

  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("leasingAgent.contact")}</h4>

      {listing.leasingAgentName && <p className="text-xl">{listing.leasingAgentName}</p>}
      {listing.leasingAgentTitle && <p className="text-gray-750">{listing.leasingAgentTitle}</p>}
      {props.managementCompany?.name && (
        <p className="text-gray-750">{props.managementCompany.name}</p>
      )}

      {listing.leasingAgentPhone && (
        <>
          <p className="mt-5">
            <a href={phoneNumber}>
              <Icon symbol="phone" size="medium" fill={IconFillColors.primary} /> {t("t.call")}{" "}
              {listing.leasingAgentPhone}
            </a>
          </p>
          <p className="text-sm text-gray-750">{t("leasingAgent.dueToHighCallVolume")}</p>
        </>
      )}

      {listing.leasingAgentEmail && (
        <p className="my-5">
          <a href={`mailto:${listing.leasingAgentEmail}`}>
            <Icon symbol="mail" size="medium" fill={IconFillColors.primary} /> {t("t.email")}
          </a>
        </p>
      )}

      {managementWebsite && (
        <p className="my-5">
          <a href={managementWebsite} target="_blank" rel="noreferrer noopener">
            <Icon symbol="globe" size="medium" fill={IconFillColors.primary} /> {t("t.website")}
          </a>
        </p>
      )}

      {listing.leasingAgentAddress && (
        <SidebarAddress
          address={listing.leasingAgentAddress}
          officeHours={listing.leasingAgentOfficeHours}
        />
      )}
    </section>
  )
}

export { LeasingAgent as default, LeasingAgent }
