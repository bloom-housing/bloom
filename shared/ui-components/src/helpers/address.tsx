import * as React from "react"
import { Address } from "@bloom-housing/core/src/general"
interface AddressProps {
  address: Address
}

export const OneLineAddress = (props: AddressProps) => (
  <>
    {props.address.streetAddress},{` `}
    {props.address.city} {props.address.state},{` `}
    {props.address.zipCode}
  </>
)

export const MultiLineAddress = (props: AddressProps) => (
  <>
    {props.address.streetAddress}
    <br />
    {props.address.city} {props.address.state},{` `}
    {props.address.zipCode}
  </>
)
