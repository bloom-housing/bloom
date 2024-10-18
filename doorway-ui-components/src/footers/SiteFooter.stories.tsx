import * as React from "react"
import { LocalizedLink } from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"
import { SiteFooter } from "./SiteFooter"
import { FooterNav } from "../navigation/FooterNav"
import { FooterSection } from "../sections/FooterSection"

export default {
  title: "Footers/Site Footer",
  parameters: {
    componentSubtitle: "Site-wide footer, shown on every page.",
  },
  component: SiteFooter,
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
      <LocalizedLink href="/policy">Policy</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const footerManyLinks = () => (
  <SiteFooter>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="/policy">Privacy Policy</LocalizedLink>
      <LocalizedLink href="/policy">Get Assistance</LocalizedLink>
      <LocalizedLink href="/policy">Give Feedback</LocalizedLink>
      <LocalizedLink href="/policy">Contact</LocalizedLink>
      <LocalizedLink href="/policy">About</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const overflowingLinks = () => (
  <SiteFooter>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="/policy">Privacy Policy</LocalizedLink>
      <LocalizedLink href="/policy">Get Assistance</LocalizedLink>
      <LocalizedLink href="/policy">Give Feedback</LocalizedLink>
      <LocalizedLink href="/policy">Contact</LocalizedLink>
      <LocalizedLink href="/policy">About</LocalizedLink>
      <LocalizedLink href="/policy">Terms and Conditions</LocalizedLink>
      <LocalizedLink href="/policy">Careers</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const withLogo = () => (
  <SiteFooter>
    <FooterSection>{logo}</FooterSection>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="/policy">Policy</LocalizedLink>
    </FooterNav>
  </SiteFooter>
)

export const withLogoAndCredits = () => (
  <SiteFooter>
    <FooterSection>{logo}</FooterSection>
    <FooterSection>{credits}</FooterSection>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="/policy">Policy</LocalizedLink>
    </FooterNav>
    <FooterSection className="bg-black" small>
      <ExygyFooter />
    </FooterSection>
  </SiteFooter>
)
