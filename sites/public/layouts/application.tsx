import React, { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
  MenuLink,
  t,
  AuthContext,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { localizeLink } from "../lib/helpers"

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
      title: t("nav.listings"),
      onClick: () => {
        localizeLink(router, "/listings", router.locale)
      },
    },
  ]
  if (process.env.housingCounselorServiceUrl) {
    menuLinks.push({
      title: t("nav.getAssistance"),
      onClick: () => {
        localizeLink(router, "/account/applications", router.locale)
      },
    })
  }
  if (profile) {
    console.log({ router })
    menuLinks.push({
      title: t("nav.myAccount"),
      subMenuLinks: [
        {
          title: t("nav.myDashboard"),
          onClick: () => {
            localizeLink(router, "/account/dashboard", router.locale)
          },
        },
        {
          title: t("nav.myApplications"),
          onClick: () => {
            localizeLink(router, "/account/applications", router.locale)
          },
        },
        {
          title: t("nav.accountSettings"),
          onClick: () => {
            localizeLink(router, "/account/edit", router.locale)
          },
        },
        {
          title: t("nav.signOut"),
          onClick: () => {
            setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
            localizeLink(router, "/sign-in", router.locale)
            signOut()
          },
        },
      ],
    })
  } else {
    menuLinks.push({
      title: t("nav.signIn"),
      onClick: () => {
        localizeLink(router, "/sign-in", router.locale)
      },
    })
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          logoSrc="/images/logo_glyph.svg"
          homeOnClick={() => {
            localizeLink(router, "/", router.locale)
          }}
          notice={
            <a href="" target="_blank" className={"cursor-pointer"}>
              {t("nav.getFeedback")}
            </a>
          }
          title={t("nav.siteTitle")}
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks}
        />
        <main id="main-content">{props.children}</main>
      </div>

      <SiteFooter>
        <FooterNav copyright={t("footer.copyright")}>
          <Link href="/privacy">
            <a>{t("pageTitle.privacy")}</a>
          </Link>
          <Link href="/disclaimer">
            <a>{t("pageTitle.disclaimer")}</a>
          </Link>
        </FooterNav>
        <FooterSection className="bg-black" small>
          <ExygyFooter />
        </FooterSection>
      </SiteFooter>
    </div>
  )
}

export default Layout
