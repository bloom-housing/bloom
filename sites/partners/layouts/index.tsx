import React, { useContext } from "react"
import Head from "next/head"
import {
  LocalizedLink,
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  t,
  AuthContext,
} from "@bloom-housing/ui-components"
import { useRouter } from "next/router"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const router = useRouter()

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

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
          language={{
            list: languages,
            codes: router?.locales,
          }}
        >
          <LocalizedLink href="/" className="navbar-item">
            {t("nav.listings")}
          </LocalizedLink>

          {profile?.roles?.isAdmin && (
            <LocalizedLink href="/users" className="navbar-item">
              {t("nav.users")}
            </LocalizedLink>
          )}

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
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
