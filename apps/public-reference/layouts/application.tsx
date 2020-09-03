import * as React from "react"
import Head from "next/head"
import {
  LocalizedLink,
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
  UserNav,
  t,
  UserContext,
} from "@bloom-housing/ui-components"
import SVG from "react-inlinesvg"
import { useContext } from "react"

const Layout = (props) => {
  const { profile, signOut } = useContext(UserContext)
  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          skip={t("nav.skip")}
          logoSrc="/images/logo_glyph.svg"
          notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
          title={t("nav.siteTitle")}
        >
          <LocalizedLink href="/listings" className="navbar-item">
            {t("nav.listings")}
          </LocalizedLink>
          {/* Only show Get Assistance if housing counselor data is available */}
          {process.env.housingCounselorServiceUrl && (
            <LocalizedLink href="/housing-counselors" className="navbar-item">
              {t("nav.getAssistance")}
            </LocalizedLink>
          )}
          <UserNav signedIn={!!profile} signOut={signOut}>
            <LocalizedLink href="/account/dashboard" className="navbar-item">
              {t("nav.myDashboard")}
            </LocalizedLink>
            <LocalizedLink href="/account/applications" className="navbar-item">
              {t("nav.myApplications")}
            </LocalizedLink>
            <LocalizedLink href="/account/settings" className="navbar-item">
              {t("nav.accountSettings")}
            </LocalizedLink>
          </UserNav>
        </SiteHeader>
        <main id="main-content">{props.children}</main>
      </div>

      <SiteFooter>
        <FooterNav copyright={t("footer.copyright")}>
          <LocalizedLink href="/privacy">{t("pageTitle.privacy")}</LocalizedLink>
          <LocalizedLink href="/disclaimer">{t("pageTitle.disclaimer")}</LocalizedLink>
        </FooterNav>
        <FooterSection className="bg-black" small>
          <ExygyFooter />
        </FooterSection>
      </SiteFooter>
      <SVG src="/images/icons.svg" />
    </div>
  )
}

export default Layout
