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

export interface MultiLineAddressProps {
  address: Address
}

const MultiLineAddress = ({ address }: MultiLineAddressProps) => {
  if (!address) return null

  const makeHtmlString = (address: Address) => {
    let str = ""

    if (address.placeName) {
      str += `${address.placeName} <br />`
    }

    if (address.street || address.street2) {
      str += `${address.street || ""} ${address.street2 || ""} <br />`
    }

    if (address.city || address.state || address.zipCode) {
      str += `${address.city ? `${address.city},` : ""} ${
        address.state ? `${address.state}` : ""
      } ${address.zipCode}`
    }

    return str
  }

  return (
    <Markdown
      options={{ disableParsingRawHTML: false }}
      children={`<span>${makeHtmlString(address)}</span>`}
    />
  )
}

export { MultiLineAddress as default, MultiLineAddress }
