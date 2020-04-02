import * as React from "react"
import moment from "moment"
import { SiteFooter, ExygyFooter, FooterNav, FooterSection } from "@bloom-housing/ui-components"

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
        For listing and application questions, please contact the Property Agent displayed on each
        listing.
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
    <FooterNav copyright={`Alameda County © ${moment().format("YYYY")} • All Rights Reserved`}>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link"
        target="_blank"
      >
        Give Feedback
      </a>
      <a href="mailto:achousingportal@acgov.org">Contact</a>
      <a href="https://www.acgov.org/government/legal.htm" target="_blank">
        Disclaimer
      </a>
      <a href="https://www.acgov.org/government/legal.htm" target="_blank">
        Privacy Policy
      </a>
    </FooterNav>
    <FooterSection className="bg-black" small>
      <ExygyFooter />
    </FooterSection>
  </SiteFooter>
)

export default AlamedaFooter
