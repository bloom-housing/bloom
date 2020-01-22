import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import SiteFooter from "./SiteFooter"

export default {
  title: "Site Footer",
  parameters: {
    componentSubtitle: "Site-wide footer, shown on every page."
  },
  component: SiteFooter,
  decorators: [withA11y]
}

export const footer = () => <SiteFooter />
