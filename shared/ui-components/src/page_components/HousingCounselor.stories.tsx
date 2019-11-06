import * as React from "react"
import { storiesOf } from "@storybook/react"
import HousingCounselor from "./HousingCounselor"

storiesOf("PageComponents|HousingCounselor", module).add("with only required fields", () => (
  <HousingCounselor counselor={{ name: "Counselor Name", languages: ["English"] }} />
))

storiesOf("PageComponents|HousingCounselor", module).add("with multiple languages", () => (
  <HousingCounselor
    counselor={{
      name: "Counselor Name",
      languages: ["English", "Spanish", "Chinese"]
    }}
  />
))

storiesOf("PageComponents|HousingCounselor", module).add("with all fields", () => (
  <HousingCounselor
    counselor={{
      name: "Counselor Name",
      languages: ["English"],
      address: "123 Main St",
      citystate: "San Francisco, CA",
      website: "www.counselor.org",
      phone: "123-456-7890"
    }}
  />
))
