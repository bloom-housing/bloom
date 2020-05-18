import * as React from "react"
import Head from "next/head"
import SVG from "react-inlinesvg"
import {
  ExygyFooter,
  FooterNav,
  FooterSection,
  LocalizedLink,
  SiteFooter,
  SiteHeader,
  t,
} from "@bloom-housing/ui-components"

const Layout = props => {
  const notice = (
    <>
      {t("nav.getFeedback")}
      <a href="https://www.surveymonkey.com/r/2QLBYML" target="_blank">
        {t("nav.yourFeedback")}
      </a>
    </>
  )

  return (
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
            {t("footer.header")}
            <br />
            <a href={t("footer.headerUrl")} target="_blank">
              {t("footer.headerLink")}
            </a>
            <br />
            <span className="text-md">
              {t("footer.inPartnershipWith")}
              <br />
              <a href={t("footer.sanMateoISDurl")} target="_blank">
                {t("footer.sanMateoISD")}
              </a>
              <br />
              <a href={t("footer.cityOfSouthSFurl")} target="_blank">
                {t("footer.cityOfSouthSF")}
              </a>
            </span>
          </p>
          <p className="mt-8 text-md">{t("footer.forListingQuestions")}</p>
          <p className="text-md">{t("footer.forGeneralInquiries")}</p>

          <p className="mt-8 text-md">
            {t("footer.forAdditionalOpportunities")}
            <br />
            <a className="px-2" href={t("footer.SFHousingUrl")} target="_blank">
              {t("footer.SFHousingPortal")}
            </a>
            |
            <a className="px-2" href={t("footer.SJHousingUrl")} target="_blank">
              {t("footer.SJHousingPortal")}
            </a>
            |
            <a className="px-2" href={t("footer.ALAHousingUrl")} target="_blank">
              {t("footer.ALAHousingPortal")}
            </a>
          </p>
        </FooterSection>
        <FooterNav copyright={t("footer.copyRight")}>
          <a href="https://www.surveymonkey.com/r/2QLBYML" target="_blank">
            {t("footer.giveFeedback")}
          </a>
          <a href="mailto:housing@smchousing.org">{t("footer.contact")}</a>
          <LocalizedLink href="/disclaimer">{t("footer.disclaimer")}</LocalizedLink>
          <LocalizedLink href="/privacy">{t("footer.privacyPolicy")}</LocalizedLink>
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
