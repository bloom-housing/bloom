import * as React from "react"
import ReactDOMServer from "react-dom/server"
import { OneLineAddress, MultiLineAddress } from "../../helpers/address"

const Address = (props: any) => {
  const address = props.address
  const office_hours = props.office_hours
  

  let mainAddress = null
  let googleMapsHref = ''
  let hours = (<></>)


  if (address.street_address) {
    const oneLineAddress = <OneLineAddress address={address} />
    mainAddress = <MultiLineAddress address={address} />

    googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)
  }

  if (office_hours) {
    hours = (
      <>
        <h3 className="my-4 text-gray-600 uppercase t-sans font-bold text-sm">
          Office Hours
        </h3>
        <p>{office_hours}</p>
      </>
    )
  }

  return (
    <>
      {address.street_address && (
        <p className="text-gray-700">
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

export default Address
