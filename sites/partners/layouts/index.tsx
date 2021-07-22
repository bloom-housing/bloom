import React, { useContext } from "react"
import Head from "next/head"
import {
  LocalizedLink,
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
  t,
  AuthContext,
} from "@bloom-housing/ui-components"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)

  return (
    <div className="site-wrapper">
      <div className="site-content site-content--wide-content">
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>

        <SiteHeader
          skip={t("nav.skip")}
          logoSrc="/images/detroit-logo.png"
          notice=""
          title={t("nav.siteTitlePartners")}
          logoWidth={"medium"}
        >
          <LocalizedLink href="/" className="navbar-item">
            {t("nav.listings")}
          </LocalizedLink>

          {!!profile && (
            <a href="#" className="navbar-item" onClick={signOut}>
              {t("nav.signOut")}
            </a>
          )}
        </SiteHeader>
        <main>{props.children}</main>

        <SiteFooter>
          <FooterSection>
            <img src="/images/detroit-logo-white.png" alt="City of Detroit logo" />
          </FooterSection>
          <FooterSection>
            <p>
              {t("footer.header")}
              <br />
              <a href={t("footer.headerUrl")} target="_blank">
                {t("footer.headerLink")}
              </a>
            </p>
          </FooterSection>
          <FooterNav copyright={t("footer.copyright")}>
            <LocalizedLink href="/privacy">{t("pageTitle.privacy")}</LocalizedLink>
            <LocalizedLink href="/disclaimer">{t("pageTitle.disclaimer")}</LocalizedLink>
          </FooterNav>
          <FooterSection className="bg-black" small>
            <ExygyFooter />
          </FooterSection>
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
