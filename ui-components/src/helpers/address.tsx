import * as React from "react"

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
      {props.address.street} {props.address.street2}
      {(props.address.street || props.address.street2) && <br />}
      {props.address.city}
      {props.address.city && (props.address.state || props.address.zipCode) && ","}{" "}
      {props.address.state} {props.address.zipCode}
    </>
  )
}
