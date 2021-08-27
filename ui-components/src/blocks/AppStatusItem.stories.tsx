import React from "react"
import { AppStatusItem } from "./AppStatusItem"

export default {
  title: "Blocks/Application Status Item",
}

export const AppStatusItemSubmitted = () => (
  <AppStatusItem
    applicationDueDate={"March 10th, 2022"}
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={"March 8th, 2022"}
    confirmationNumber={"1234abcd"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)

export const AppStatusItemNoConfirmationNumberOrDueDate = () => (
  <AppStatusItem
    applicationURL={"application/1234abcd"}
    applicationUpdatedAt={"March 8th, 2022"}
    listingName={"Listing Name"}
    listingURL={"/listing/abcd1234/listing-name"}
  />
)
