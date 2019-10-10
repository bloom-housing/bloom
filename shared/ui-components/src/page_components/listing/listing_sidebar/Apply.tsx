import React, { useState } from "react"
import { Listing } from "../../../types"
import Button from "../../../atoms/Button"
import SidebarAddress from "./SidebarAddress"

interface ApplyProps {
  listing: Listing
}

const OrDivider = (props: { bgColor: string }) => (
  <div className="-mx-5 mt-6 mb-2 border-t border-gray-400 text-center">
    <span
      className={`bg-${props.bgColor} relative -top px-1 uppercase text-blue-700 font-semibold`}
    >
      or
    </span>
  </div>
)

const SubHeader = (props: { text: string }) => (
  <h3 className="text-gray-600 uppercase font-alt-sans font-bold text-sm mb-4">{props.text}</h3>
)

const NumberedHeader = (props: { num: number; text: string }) => (
  <div className="t-serif text-xl mb-4">
    <span className="text-blue-600 pr-1">{props.num}</span>
    {props.text}
  </div>
)

const Apply = (props: ApplyProps) => {
  const { listing } = props

  const leasingAgentAddress = () => ({
    streetAddress: listing.leasing_agent_street,
    city: listing.leasing_agent_city,
    state: listing.leasing_agent_state,
    zipCode: listing.leasing_agent_zip
  })
  const applicationAddress = () => ({
    streetAddress: listing.application_street_address,
    city: listing.application_city,
    state: listing.application_state,
    zipCode: listing.application_postal_code
  })

  const [showDownload, setShowDownload] = useState(false)
  const toggleDownload = () => setShowDownload(!showDownload)

  return (
    <>
      <section className="border-gray-400 border-b p-5">
        <h2 className="font-alt-sans uppercase mb-5 pb-2 border-0 border-b-4 border-blue-600 font-semibold text-gray-700 tracking-wider inline-block">
          How to Apply
        </h2>
        <NumberedHeader num={1} text="Get a Paper Application" />
        <Button filled className="w-full mb-2" onClick={toggleDownload}>
          Download Application
        </Button>
        {showDownload && (
          <p className="text-center mt-2 mb-4 text-sm">
            <a href={listing.application_download_url} title="Download Application" target="_blank">
              English
            </a>
          </p>
        )}
        {listing.blank_paper_application_can_be_picked_up && (
          <>
            <OrDivider bgColor="white" />
            <SubHeader text="Pick up an application" />
            <SidebarAddress
              address={leasingAgentAddress()}
              officeHours={listing.leasing_agent_office_hours}
            />
          </>
        )}
      </section>

      <section className="border-gray-400 border-b p-5 bg-gray-100">
        <NumberedHeader num={2} text="Submit a Paper Application" />
        {listing.accepting_applications_by_po_box && (
          <>
            <SubHeader text="Send Application by US Mail" />
            <p className="text-gray-700">{listing.application_organization}</p>
            <SidebarAddress address={applicationAddress()} />
            <p className="mt-4 text-sm text-gray-600">
              Applications must be received by the deadline and postmarks will not be considered.
            </p>
          </>
        )}
        {listing.accepting_applications_by_po_box &&
          listing.accepting_applications_at_leasing_agent && <OrDivider bgColor="gray-100" />}
        {listing.accepting_applications_at_leasing_agent && (
          <>
            <SubHeader text="Drop Off Application" />
            <SidebarAddress
              address={leasingAgentAddress()}
              officeHours={listing.leasing_agent_office_hours}
            />
          </>
        )}
      </section>
    </>
  )
}

export default Apply
