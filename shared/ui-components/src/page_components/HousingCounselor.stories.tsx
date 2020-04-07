import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import HousingCounselor from "./HousingCounselor"

export default {
  title: "PageComponents|HousingCounselor",
  decorators: [withA11y],
}

export const withOnlyRequiredFields = () => (
  <HousingCounselor counselor={{ name: "Counselor Name", languages: ["English"] }} />
)

export const withMultipleLanguages = () => (
  <HousingCounselor
    counselor={{
      name: "Counselor Name",
      languages: ["English", "Spanish", "Chinese"],
    }}
  />
)

export const withAllFields = () => (
  <HousingCounselor
    counselor={{
      name: "Counselor Name",
      languages: ["English"],
      address: "123 Main St",
      citystate: "San Francisco, CA",
      website: "www.counselor.org",
      phone: "123-456-7890",
    }}
  />
)
