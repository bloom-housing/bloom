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
const links = [{ href: "#", title: "Policy" }]
const credits = (
  <>
    <p>
      Alameda County Housing Portal is a project of the
      <br />
      <a href="https://www.acgov.org/cda/hcd/" target="_blank">
        Alameda County - Housing and Community Development (HCD) Department
      </a>
    </p>
  </>
)
const logo = <img src="/images/logo_glyph.svg" alt="Alameda Logo" />

export const footer = () => (
  <SiteFooter links={links} copyright="Alameda County © 2020 • All Rights Reserved" />
)

export const withLogo = () => (
  <SiteFooter links={links} copyright="Alameda County © 2020 • All Rights Reserved" logo={logo} />
)

export const withLogoAndCredits = () => (
  <SiteFooter
    links={links}
    copyright="Alameda County © 2020 • All Rights Reserved"
    logo={logo}
    credits={credits}
  />
)
