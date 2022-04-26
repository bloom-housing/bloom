import * as React from "react"
import Markdown from "markdown-to-jsx"

export interface Address {
  city?: string
  latitude?: number
  longitude?: number
  placeName?: string
  state?: string
  street2?: string
  street?: string
  zipCode?: string
}

interface AddressProps {
  address: Address
}

export const OneLineAddress = (props: AddressProps) => {
  if (!props.address) return null

  return (
    <>
      {props.address.street},{` `}
      {props.address.city}, {props.address.state} {props.address.zipCode}
    </>
  )
}

export const MultiLineAddress = (props: AddressProps) => {
  if (!props.address) return null

  return (
    <>
      {props.address.placeName && (
        <>
          {props.address.placeName}
          <br />
        </>
      )}
      <Markdown children={props.address.street || ""} />
      <br />
      {props.address.street2 && (
        <>
          {props.address.street2}
          <br />
        </>
      )}
      {props.address.city}, {props.address.state} {props.address.zipCode}
    </>
  )
}
