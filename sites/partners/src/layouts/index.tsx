import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  SiteFooter,
  FooterSection,
  t,
  MenuLink,
  setSiteAlertMessage,
  SiteHeader,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FooterNav } from "../../../../detroit-ui-components/src/navigation/FooterNav"

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
          logoSrc="/images/detroit-logo.png"
          title={t("nav.siteTitlePartners")}
          logoWidth={"wide"}
          menuLinks={menuLinks}
          siteHeaderWidth={"wide"}
          homeURL={"/"}
          logoClass={"md:h-36 md:mt-0"}
          strings={{
            skipToMainContent: t("nav.skip"),
            menu: t("t.menu"),
            close: t("t.close"),
            logoAriaLable: "City of Detroit logo",
          }}
          mainContentId={"main-content"}
        />

        <main id={"main-content"}>{props.children}</main>

        <SiteFooter>
          <FooterSection>
            <img src="/images/detroit-logo-white.png" alt="City of Detroit logo" />
          </FooterSection>
          <FooterSection>
            <p>
              {t("footer.header")}
              <br />
              <a
                href="https://detroitmi.gov/departments/housing-and-revitalization-department"
                target="_blank"
              >
                {t("footer.headerLink")}
              </a>
            </p>
          </FooterSection>
          <FooterNav copyright={`City of Detroit © ${currentYear} • All Rights Reserved`} />
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
