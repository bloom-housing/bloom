import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  t,
  MenuLink,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { AuthContext, ExygyFooter } from "@bloom-housing/shared-helpers"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const menuLinks: MenuLink[] = []
  if (profile) {
    menuLinks.push({
      title: t("nav.listings"),
      href: "/",
    })
  }
  if (profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin) {
    menuLinks.push({
      title: t("nav.users"),
      href: "/users",
    })
  }
  if (
    profile?.jurisdictions?.some((jurisdiction) => !!jurisdiction.enablePartnerSettings) &&
    (profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin)
  ) {
    menuLinks.push({
      title: t("t.settings"),
      href: "/settings",
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
          siteHeaderWidth={"wide"}
          homeURL={"/"}
        />

        <main>{props.children}</main>

        <SiteFooter>
          <FooterNav copyright={`© ${currentYear} • All Rights Reserved`} />
          <FooterSection className="bg-black" small>
            <ExygyFooter />
          </FooterSection>
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
