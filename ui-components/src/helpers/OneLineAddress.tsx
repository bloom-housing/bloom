import * as React from "react"
import { Address } from "./MultiLineAddress"

export interface OneLineAddressProps {
  address: Address
}

const OneLineAddress = ({ address }: OneLineAddressProps) => {
  if (!address) return null

  return (
    <>
      {address.street} {address.street2}
      {address.street && `, `}
      {address.city}
      {address.city && (address.state || address.zipCode) && ","} {address.state} {address.zipCode}
    </>
  )
}

export { OneLineAddress as default, OneLineAddress }
