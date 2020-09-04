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
    <div className="site-container">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          skip={t("nav.skip")}
          logoSrc="/images/logo_glyph.svg"
          notice={
            <>
              This is a preview of our new website. We're just getting started. We'd love to get{" "}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link"
                target="_blank"
              >
                your feedback
              </a>
              .
            </>
          }
          title={t("nav.siteTitle")}
        >
          <LocalizedLink href="/listings" className="navbar-item">
            {t("nav.browseProperties")}
          </LocalizedLink>
          <a href="https://www.acgov.org/cda/hcd/index.htm" target="_blank" className="navbar-item">
            {t("nav.getAssistance")}
          </a>
          {/* Only show Get Assistance if housing counselor data is available */}
          {process.env.housingCounselorServiceUrl && (
            <LocalizedLink href="/housing-counselors" className="navbar-item">
              {t("nav.getAssistance")}
            </LocalizedLink>
          )}
          {/* <UserNav signedIn={!!profile} signOut={signOut}>
            <LocalizedLink href="/account/dashboard" className="navbar-item">
              {t("nav.myDashboard")}
            </LocalizedLink>
            <LocalizedLink href="/account/applications" className="navbar-item">
              {t("nav.myApplications")}
            </LocalizedLink>
            <LocalizedLink href="/account/settings" className="navbar-item">
              {t("nav.accountSettings")}
            </LocalizedLink>
          </UserNav> */}
        </SiteHeader>
        <main id="main-content">{props.children}</main>
      </div>
      <SiteFooter>
        <FooterSection>
          <img src="/images/alameda-logo-white.svg" alt="Alameda County" />
        </FooterSection>
        <FooterSection>
          <p>
            {t("footer.header")}
            <br />
            <a href={t("footer.headerUrl")} target="_blank">
              {t("footer.headerLink")}
            </a>
          </p>
          <p className="mt-10 text-tiny">{t("footer.forListingQuestions")}</p>
          <p className="text-tiny">{t("footer.forGeneralInquiries")}</p>
          <p className="mt-10 text-tiny">
            {t("footer.forAdditionalOpportunities")}
            <br />
            <a className="px-2" href={t("footer.SFHousingUrl")} target="_blank">
              {t("footer.SFHousingPortal")}
            </a>
            |
            <a className="px-2" href="https://smc.housingbayarea.org/" target="_blank">
              San Mateo County Housing Portal
            </a>
            |
            <a className="px-2" href="https://housing.sanjoseca.gov/" target="_blank">
              City of San José Housing Portal
            </a>
          </p>
        </FooterSection>
        <FooterSection>
          <img
            className="h-16 w-16"
            src="/images/eho-logo-white.svg"
            alt="Equal Housing Opportunity Logo"
          />
        </FooterSection>
        <FooterNav copyright={t("footer.copyRight")}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link"
            target="_blank"
          >
            {t("footer.giveFeedback")}
          </a>
          <a href="mailto:achousingportal@acgov.org">{t("footer.contact")}</a>
          <a href="https://www.acgov.org/government/legal.htm" target="_blank">
            {t("footer.disclaimer")}
          </a>
          <a href="https://www.acgov.org/government/legal.htm" target="_blank">
            {t("footer.privacyPolicy")}
          </a>
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
