import * as React from "react"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import LocalizedLink from "@bloom-housing/ui-components/src/atoms/LocalizedLink"
import SiteHeader from "@bloom-housing/ui-components/src/headers/SiteHeader/SiteHeader"
import SiteFooter from "@bloom-housing/ui-components/src/footers/SiteFooter/SiteFooter"
import SVG from "react-inlinesvg"
import WelcomeHeader from "../components/WelcomeHeader"

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
    <SiteFooter />
    <SVG src="/images/icons.svg" />
  </div>
)

export default Layout
