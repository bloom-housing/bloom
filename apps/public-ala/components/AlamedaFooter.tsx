import * as React from "react"
import {
  LocalizedLink,
  SiteFooter,
  ExygyFooter,
  FooterNav,
  FooterSection
} from "@bloom-housing/ui-components"

const AlamedaFooter = () => (
  <SiteFooter>
    <FooterSection>
      <img src="/images/Alameda-County-seal.png" alt="Alameda County" />
    </FooterSection>
    <FooterSection>
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
        <br />
        <a href="https://smc.housingbayarea.org/" target="_blank">
          San Mateo County Housing Portal
        </a>
        <br />
        <a href="https://housing.sanjoseca.gov/" target="_blank">
          City of San José Housing Portal
        </a>
      </p>
    </FooterSection>
    <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
      <LocalizedLink href="#">Policy</LocalizedLink>
    </FooterNav>
    <FooterSection className="bg-black" small>
      <ExygyFooter />
    </FooterSection>
  </SiteFooter>
)

export default AlamedaFooter
