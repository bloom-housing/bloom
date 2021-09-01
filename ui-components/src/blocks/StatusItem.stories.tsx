import React from "react"
import { StatusItem } from "./StatusItem"

export default {
  title: "Blocks/Status Item",
}

export const StatusItemSubmitted = () => (
  <StatusItem
    applicationDueDate={"March 10th, 2022"}
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={"March 8th, 2022"}
    confirmationNumber={"1234abcd"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)

export const StatusItemNoConfirmationNumberOrDueDate = () => (
  <StatusItem
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={"March 8th, 2022"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)
