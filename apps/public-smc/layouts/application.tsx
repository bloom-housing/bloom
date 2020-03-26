import * as React from "react"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import LocalizedLink from "@bloom-housing/ui-components/src/atoms/LocalizedLink"
import SiteHeader from "@bloom-housing/ui-components/src/headers/SiteHeader/SiteHeader"
import SiteFooter from "@bloom-housing/ui-components/src/footers/SiteFooter/SiteFooter"
import FooterNav from "@bloom-housing/ui-components/src/footers/FooterNav/FooterNav"
import FooterSection from "@bloom-housing/ui-components/src/footers/FooterSection/FooterSection"
import ExygyFooter from "@bloom-housing/ui-components/src/footers/ExygyFooter"
import SVG from "react-inlinesvg"

const notice = <a href="https://www.surveymonkey.com/r/2QLBYML">We love to get your feedback</a>
const Layout = props => (
  <div>
    <Head>
      <title>{t("nav.siteTitle")}</title>
    </Head>
    <SiteHeader logoSrc="/images/logo_glyph.svg" notice={notice} title={t("nav.siteTitle")}>
      <LocalizedLink href="/listings" className="navbar-item">
        {t("nav.listings")}
      </LocalizedLink>
      {/* Only show Get Assistance if housing counselor data is available */}
      {process.env.housingCounselorServiceUrl && (
        <a href={process.env.housingCounselorServiceUrl} className="navbar-item">
          {t("nav.getAssistance")}
        </a>
      )}
    </SiteHeader>
    <main>{props.children}</main>
    <SiteFooter>
      <FooterSection>
        <img src="/images/logo-smc.png" />
      </FooterSection>
      <FooterSection>
        <p>
          San Mateo County Housing Portal is a project of the
          <br />
          <a href="https://housing.smcgov.org/" target="_blank">
            San Mateo County's Department of Housing
          </a>
          <br />
          in partnership with
          <br />
          <a href="https://isd.smcgov.org/" target="_blank">
            San Mateo County's Information Services Department
          </a>
          <br />
          <a href="http://www.ssf.net/" target="_blank">
            City of South San Francisco
          </a>
        </p>
        <p className="mt-10 text-sm">
          For listing and application questions, please contact the Property Agent displayed on the
          LISTING
        </p>
        <p className="text-sm">For general program inquiries, you may call DOH at 650-802-5050</p>
        <p className="mt-10 text-sm">
          For additional Bay Area opportunities, please visit:
          <br />
          <a href="https://housing.sfgov.org" target="_blank">
            San Francisco Housing Portal
          </a>
        </p>
      </FooterSection>
      <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
        <LocalizedLink href="#">Policy</LocalizedLink>
        <LocalizedLink href="/disclaimer">Disclaimer</LocalizedLink>
      </FooterNav>
      <FooterSection className="bg-black" small>
        <ExygyFooter />
      </FooterSection>
    </SiteFooter>
    <SVG src="/images/icons.svg" />
  </div>
)

export default Layout
