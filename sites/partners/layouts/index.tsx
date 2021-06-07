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
  UserContext,
} from "@bloom-housing/ui-components"

const Layout = (props) => {
  const { profile, signOut } = useContext(UserContext)

  return (
    <div className="site-wrapper">
      <div className="site-content site-content--wide-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>

        <SiteHeader
          skip={t("nav.skip")}
          logoSrc="/images/logo_glyph.svg"
          notice=""
          title={t("nav.siteTitle")}
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
          <FooterNav copyright="© 2020 • All Rights Reserved">
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
