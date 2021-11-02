import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  LocalizedLink,
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
  t,
  AuthContext,
  MenuLink,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const router = useRouter()

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
          notice={" "}
          logoWidth={"medium"}
          menuLinks={menuLinks}
          siteHeaderWidth={"wide"}
          homeURL={"/"}
        />

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
