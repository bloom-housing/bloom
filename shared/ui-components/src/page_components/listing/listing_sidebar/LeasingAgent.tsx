import * as React from "react"
import Address from "./SidebarAddress"
import t from "../../../helpers/translator"
import { Listing } from "../../../types"

interface LeasingAgentProps {
  listing: Listing
}

const LeasingAgent = (props: LeasingAgentProps) => {
  const listing = props.listing

  const phoneNumber = `tel:${listing.leasing_agent_phone.replace(/[-()]/g, "")}`
  const leasingAgentAddress = {
    streetAddress: listing.leasing_agent_street,
    city: listing.leasing_agent_city,
    state: listing.leasing_agent_state,
    zipCode: listing.leasing_agent_zip
  }

  return (
    <>
      <h4 className="t-alt-sans uppercase mb-5 pb-2 border-0 border-b-4 border-blue-600 font-semibold text-gray-700 tracking-wider">
        Contact Leasing Agent
      </h4>

      <p className="text-xl">{listing.leasing_agent_name}</p>
      <p className="text-gray-700">{listing.leasing_agent_title}</p>

      <p className="mt-5">
        <a href={phoneNumber}>Call {listing.leasing_agent_phone}</a>
      </p>
      <p className="text-sm text-gray-700">{t("LEASING_AGENT.DUE_TO_HIGH_CALL_VOLUME")}</p>

      <p className="my-5">
        <a href={`mailto:${listing.leasing_agent_email}`}>Email</a>
      </p>

      <Address address={leasingAgentAddress} officeHours={listing.leasing_agent_office_hours} />
    </>
  )
}

export default LeasingAgent
