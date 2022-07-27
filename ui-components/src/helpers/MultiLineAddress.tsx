import * as React from "react"
import sanitizeHtml from "sanitize-html"

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

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(
          `
            ${address.placeName ? `${address.placeName} <br />` : ""}
            ${address.street || ""} ${address.street2 || ""}
            ${address.street || address.street2 ? `<br />` : ""}
            ${address.city}
            ${address.city && (address.state || address.zipCode) ? "," : ""} ${address.state} ${` `}
            ${address.zipCode}
          `
        ),
      }}
    />
  )
}

export { MultiLineAddress as default, MultiLineAddress }
