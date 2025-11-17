import * as React from "react"
import Markdown from "markdown-to-jsx"
import { Address } from "../../types/backend-swagger"

export interface MultiLineAddressProps {
  address: Omit<Address, "id" | "createdAt" | "updatedAt">
}

const MultiLineAddress = ({ address }: MultiLineAddressProps) => {
  if (!address) return null

  let addressHTML = ""

  if (address.placeName) {
    addressHTML += `${address.placeName} <br />`
  }

  if (address.street || address.street2) {
    addressHTML += `${address.street || ""} ${address.street2 || ""} <br />`
  }

  if (address.city || address.state || address.zipCode) {
    addressHTML += `${address.city ? `${address.city},` : ""} ${address.state || ""} ${
      address.zipCode || ""
    }`
  }
  addressHTML = `<span>${addressHTML}</span>`

  return <Markdown options={{ disableParsingRawHTML: false }} children={addressHTML} />
}

export { MultiLineAddress as default, MultiLineAddress }
