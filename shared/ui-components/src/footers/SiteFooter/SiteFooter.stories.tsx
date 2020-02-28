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

export const footer = () => (
  <SiteFooter links={links} copyright="Alameda County © 2020 • All Rights Reserved" />
)

const logo = <img src="/images/logo_glyph.svg" alt="Alameda Logo" />

export const withLogo = () => (
  <SiteFooter links={links} copyright="Alameda County © 2020 • All Rights Reserved" logo={logo} />
)

const credits = (
  <>
    <p>
      Alameda County Housing Portal is a project of the
      <br />
      <a href="https://www.acgov.org/cda/hcd/" target="_blank">
        Alameda County - Housing and Community Development (HCD) Department
      </a>
    </p>

    <p className="mt-10 text-sm">
      For listing and application questions, please contact the Property Agent displayed on the
      LISTING
    </p>

    <p className="text-sm">
      For general program inquiries, you may call the Alameda County HCD at 510-670-5404.
    </p>

    <p className="mt-10 text-sm">
      For additional Bay Area opportunities, please visit:
      <br />
      <a href="https://housing.sfgov.org" target="_blank">
        San Francisco Housing Portal
      </a>
    </p>
  </>
)

export const withLogoAndCredits = () => (
  <SiteFooter
    links={links}
    copyright="Alameda County © 2020 • All Rights Reserved"
    logo={logo}
    credits={credits}
  />
)
