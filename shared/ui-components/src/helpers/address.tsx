import * as React from "react"

export const OneLineAddress = (props: any) => (
  <>
    {props.address.streetAddress},{` `}
    {props.address.city} {props.address.state},{` `}
    {props.address.zipCode}
  </>
)

export const MultiLineAddress = (props: any) => (
  <>
    {props.address.streetAddress}
    <br />
    {props.address.city} {props.address.state},{` `}
    {props.address.zipCode}
  </>
)
