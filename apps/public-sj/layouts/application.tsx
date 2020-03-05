import * as React from "react"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import LocalizedLink from "@bloom-housing/ui-components/src/atoms/LocalizedLink"
import SiteHeader from "@bloom-housing/ui-components/src/headers/SiteHeader/SiteHeader"
import SiteFooter from "@bloom-housing/ui-components/src/footers/SiteFooter/SiteFooter"
import FooterNav from "@bloom-housing/ui-components/src/footers/FooterNav/FooterNav"
import FooterSection from "@bloom-housing/ui-components/src/footers/FooterSection/FooterSection"
import SVG from "react-inlinesvg"
import WelcomeHeader from "../components/WelcomeHeader"
import ExygyFooter from "@bloom-housing/ui-components/src/footers/ExygyFooter"

const notice = (
  <LocalizedLink href="https://docs.google.com/forms/d/e/1FAIpQLScFVVvd7FDa7puUN4iH2SBl_KAWBu8dRTXNuLIt8Ff9iYF3uA/viewform">
    We'd love to get your feedback.
  </LocalizedLink>
)

const Layout = props => (
  <div>
    <Head>
      <title>{t("nav.siteTitle")}</title>
    </Head>
    <WelcomeHeader />
    <SiteHeader logoSrc="/images/logo_glyph.svg" notice={notice} title={t("nav.siteTitle")}>
      <LocalizedLink href="/listings" className="navbar-item">
        {t("nav.listings")}
      </LocalizedLink>
      {process.env.housingCounselorServiceUrl && (
        <LocalizedLink href={process.env.housingCounselorServiceUrl} className="navbar-item">
          {t("nav.getAssistance")}
        </LocalizedLink>
      )}
    </SiteHeader>
    <main>{props.children}</main>

    <SiteFooter>
      <FooterSection>
        <img src="/images/logo-sj.png" />
      </FooterSection>
      <FooterSection>
        <p>
          San José Housing Portal is a project of the
          <br />
          <a href="http://www.sanjoseca.gov/housing" target="_blank">
            City of San José - Housing Department
          </a>
        </p>
        <p className="mt-10 text-sm">
          For listing and application questions, please contact the Property Agent displayed on the
          LISTING
        </p>
        <p className="text-sm">
          For general program inquiries, you may call the Housing Department at 408-535-3860.
        </p>

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
