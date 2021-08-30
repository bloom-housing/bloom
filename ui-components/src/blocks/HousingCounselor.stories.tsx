import * as React from "react"

import { HousingCounselor } from "./HousingCounselor"

export default {
  title: "Blocks/Housing Counselor",
}

export const withOnlyRequiredFields = () => (
  <HousingCounselor name={"Counselor Name"} languages={["English"]} />
)

export const withMultipleLanguages = () => (
  <HousingCounselor name={"Counselor Name"} languages={["English", "Spanish", "Chinese"]} />
)

export const withAllFields = () => (
  <HousingCounselor
    name={"Counselor Name"}
    languages={["English"]}
    addressStreet={"123 Main St"}
    addressCityState={"San Francisco, CA"}
    website={"www.counselor.org"}
    phone={"123-456-7890"}
  />
)
