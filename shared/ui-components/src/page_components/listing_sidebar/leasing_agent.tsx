import * as React from 'react';
import ReactDOMServer from "react-dom/server";
import { OneLineAddress, MultiLineAddress } from "../../helpers/address";

const LeasingAgent = (props: any) => {
  const listing = props.listing

  const phoneNumber = `tel:${listing.leasing_agent_phone.replace(/[-\(\)]/g, '')}`

  let leasingAddress = null
  let googleMapsHref = null

  if (listing.leasing_agent_street) {
    const address = {
      street_address: listing.leasing_agent_street,
      city: listing.leasing_agent_city,
      state: listing.leasing_agent_state,
      zip_code: listing.leasing_agent_zip
    }
    const oneLineAddress = <OneLineAddress address={address} />
    leasingAddress = <MultiLineAddress address={address} />

    googleMapsHref =
        "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)
  }

  return (
    <>
      <h4 className="t-alt-sans uppercase mb-5 pb-2 border-0 border-b-4 border-blue-600 font-semibold text-gray-700 tracking-wider">Contact Leasing Agent</h4>

      <p className="text-xl">{listing.leasing_agent_name}</p>
      <p className="text-gray-700">{listing.leasing_agent_title}</p>

      <p className="mt-5"><a href={phoneNumber}>Call {listing.leasing_agent_phone}</a></p>
      <p className="text-sm text-gray-700">Due to high call volume you may hear a message.</p>

      <p className="mt-5"><a href={`mailto:${listing.leasing_agent_email}`}>Email</a></p>

      {listing.leasing_agent_street > 0 && 
        (<p className="mt-5 text-gray-700">{leasingAddress}<br/>
        <a href={googleMapsHref} target="_blank">Get Directions</a></p>)
      }

      <p className="my-5 text-gray-600 uppercase"><strong>Office Hours</strong></p>

      <p>{listing.leasing_agent_office_hours}</p>
    </>
  )
}

export default LeasingAgent
