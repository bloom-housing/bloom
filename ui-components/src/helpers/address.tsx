import * as React from "react"
import { Address } from "@bloom-housing/backend-core/types"
import Markdown from "markdown-to-jsx"
interface AddressProps {
  address: Address
}

export const OneLineAddress = (props: AddressProps) => (
  <>
    {props.address.street},{` `}
    {props.address.city}, {props.address.state} {props.address.zipCode}
  </>
)

export const MultiLineAddress = (props: AddressProps) => (
  <>
    {props.address.placeName && (
      <>
        {props.address.placeName}
        <br />
      </>
    )}
    <Markdown children={props.address.street || ""} />
    <br />
    {props.address.city}, {props.address.state} {props.address.zipCode}
  </>
)
