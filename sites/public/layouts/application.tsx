import React, { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  MenuLink,
  t,
  AuthContext,
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

  const menuLinks: MenuLink[] = [
    {
      title: t("pageTitle.about"),
      href: "/about",
    },
    {
      title: t("pageTitle.resources"),
      href: "/resources",
    },
  ]
  if (profile) {
    menuLinks.push({
      title: t("nav.myAccount"),
      subMenuLinks: [
        {
          title: t("nav.myDashboard"),
          href: "/account/dashboard",
        },
        {
          title: t("nav.accountSettings"),
          href: "/account/edit",
        },
        {
          title: t("nav.signOut"),
          onClick: async () => {
            setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
            await router.push("/sign-in")
            signOut()
          },
        },
      ],
    })
  } else {
    menuLinks.push({
      title: t("nav.signIn"),
      href: "/sign-in",
      class: "navbar-link__sign-in",
    })
    menuLinks.push({
      title: t("nav.signUp"),
      href: "/create-account",
      class: "navbar-link__sign-up",
    })
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          logoSrc="/images/detroit-logo.png"
          homeURL="/"
          title={t("nav.siteTitle")}
          subtitle="City of Detroit"
          logoWidth={"medium"}
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks}
          desktopMinWidth={1024}
        />
        <main id="main-content">{props.children}</main>
      </div>

      <SiteFooter>
        <h2 className="sr-only">{t("footer.srHeading")}</h2>
        <FooterSection>
          <img src="/images/detroit-logo-white.png" alt="City of Detroit logo"/>
        </FooterSection>
        <FooterSection>
          <h3 className="sr-only">{t("footer.srProjectInformation")}</h3>
          <p>
            <h4>
            {t("footer.header")}
            </h4>
            <a href={t("footer.headerUrl")} target="_blank">
              {t("footer.headerLink")}
            </a>
            <p className="righthand"> 
              <a className="subheader">{t("footer.forGeneralInquiries")}</a>
              <p className="mt-10 text-tiny">{t("footer.youMayCall")}</p>
            </p> 
            <p className="righthand"> 
              <a className="subheader">{t("footer.forListingQuestions")}</a>
              <p className="mt-10 text-tiny">{t("footer.pleaseContact")}</p>
           </p>
          </p>
        </FooterSection>
      </SiteFooter>
    </div>
  )
}

export default Layout
