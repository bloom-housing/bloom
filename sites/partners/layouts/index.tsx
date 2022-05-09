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
              <a
                href="https://detroitmi.gov/departments/housing-and-revitalization-department"
                target="_blank"
              >
                {t("footer.headerLink")}
              </a>
            </p>
          </FooterSection>
          <FooterNav copyright={`City of Detroit © ${currentYear} • All Rights Reserved`}>
            <LocalizedLink href={`${process.env.publicBaseUrl}/privacy`}>
              {t("pageTitle.privacy")}
            </LocalizedLink>{" "}
            <LocalizedLink href={`${process.env.publicBaseUrl}/terms`}>
              {t("pageTitle.terms")}
            </LocalizedLink>
          </FooterNav>
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
