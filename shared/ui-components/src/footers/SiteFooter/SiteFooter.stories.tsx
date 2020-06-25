import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import SiteFooter from "./SiteFooter"
import FooterNav from "../FooterNav/FooterNav"
import LocalizedLink from "../../atoms/LocalizedLink"
import ExygyFooter from "../ExygyFooter"
import FooterSection from "../FooterSection/FooterSection"

export default {
  title: "Footers|Site Footer",
  parameters: {
    componentSubtitle: "Site-wide footer, shown on every page.",
  },
  component: SiteFooter,
  decorators: [withA11y],
}

const credits = (
  <>
    <p>
      Alameda County Housing Portal is a project of the
      <br />
      <a href="https://www.acgov.org/cda/hcd/" target="_blank">
        Alameda County - Housing and Community Development (HCD) Department
      </a>
    </p>
    <p>
      <img
        className="h-16 w-16"
        src="/images/eho-logo-white.svg"
        alt="Equal Housing Opportunity Logo"
      />
    </p>
  </>
)
const logo = <img src="/images/alameda-logo-white.svg" alt="Alameda Logo" />

export const footer = () => (
  <SiteFooter>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="#">Policy</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const withLogo = () => (
  <SiteFooter>
    <FooterSection>{logo}</FooterSection>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="#">Policy</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const withLogoAndCredits = () => (
  <SiteFooter>
    <FooterSection>{logo}</FooterSection>
    <FooterSection>{credits}</FooterSection>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="#">Policy</LocalizedLink>
    </FooterNav>
    <FooterSection className="bg-black" small>
      <ExygyFooter />
    </FooterSection>
  </SiteFooter>
)
