import * as React from "react"
import { BADGES } from "../../../.storybook/constants"

import { ListingDetailHeader } from "./ListingDetailHeader"

export default {
  title: "Listing/ListingDetailHeader 🚩",
  parameters: {
    badges: [BADGES.GEN2],
  },
}

export const Default = () => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <ListingDetailHeader
        imageAlt={"Building"}
        imageSrc="https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/listing-eligibility_advdnd.jpg"
        title={"Title"}
        subtitle={"Subtitle"}
      />
    </div>
  )
}
