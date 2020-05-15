import * as React from "react"
import Head from "next/head"
import SVG from "react-inlinesvg"
import WelcomeHeader from "../components/WelcomeHeader"
import {
  ExygyFooter,
  FooterSection,
  FooterNav,
  LocalizedLink,
  SiteFooter,
  SiteHeader,
  t,
} from "@bloom-housing/ui-components"

const notice = (
  <LocalizedLink href="https://docs.google.com/forms/d/e/1FAIpQLScFVVvd7FDa7puUN4iH2SBl_KAWBu8dRTXNuLIt8Ff9iYF3uA/viewform">
    We'd love to get your feedback.
  </LocalizedLink>
)

const Layout = (props) => (
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
          {t("footer.header")}
          <br />
          <a href={t("footer.headerUrl")} target="_blank">
            {t("footer.headerLink")}
          </a>
        </p>
        <p className="mt-10 text-sm">{t("footer.forListingQuestions")}</p>
        <p className="text-sm">{t("footer.forGeneralInquiries")}</p>

        <p className="mt-10 text-sm">
          {t("footer.forAdditionalOpportunities")}
          <br />
          <a href={t("footer.SFHousingUrl")} target="_blank">
            {t("footer.SFHousingPortal")}
          </a>
        </p>
      </FooterSection>
      <FooterNav copyright={t("footer.copyRight")}>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScFVVvd7FDa7puUN4iH2SBl_KAWBu8dRTXNuLIt8Ff9iYF3uA/viewform?usp=sf_link">
          {t("footer.giveFeedback")}
        </a>
        <a href="mailto:housing@sanjoseca.gov">{t("footer.contact")}</a>
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

export default Layout
