import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  LocalizedLink,
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  t,
  AuthContext,
  MenuLink,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const router = useRouter()

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  const menuLinks: MenuLink[] = []
  if (profile) {
    menuLinks.push({
      title: t("nav.listings"),
      href: "/",
    })
  }
  if (profile?.roles?.isAdmin) {
    menuLinks.push({
      title: t("nav.users"),
      href: "/users",
    })
  }
  if (profile) {
    menuLinks.push({
      title: t("nav.signOut"),
      onClick: async () => {
        setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
        await router.push("/sign-in")
        signOut()
      },
    })
  }
  return (
    <div className="site-wrapper">
      <div className="site-content site-content--wide-content">
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>

        <SiteHeader
          logoSrc="/images/logo_glyph.svg"
          title={t("nav.siteTitlePartners")}
          logoWidth={"medium"}
          menuLinks={menuLinks}
          homeURL={"/"}
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
        />

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
            <LocalizedLink href={`${process.env.publicBaseUrl}/privacy`}>
              {t("pageTitle.privacy")}
            </LocalizedLink>{" "}
            <LocalizedLink href={`${process.env.publicBaseUrl}/disclaimer`}>
              {t("pageTitle.disclaimer")}
            </LocalizedLink>
          </FooterNav>
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
