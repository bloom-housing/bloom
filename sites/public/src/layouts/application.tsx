import React, { useContext } from "react"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import Head from "next/head"
import { JurisdictionFooterSection as SanMateoFooter } from "../page_content/jurisdiction_overrides/san_mateo/jurisdiction-footer-section"
import { JurisdictionFooterSection as SanJoseFooter } from "../page_content/jurisdiction_overrides/san_jose/jurisdiction-footer-section"
import { JurisdictionFooterSection as AlamedaFooter } from "../page_content/jurisdiction_overrides/alameda/jurisdiction-footer-section"
import { JursidictionSiteNotice as SanJoseNotice } from "../page_content/jurisdiction_overrides/san_jose/jurisdiction-site-notice"
import { JursidictionSiteNotice as AlamedaNotice } from "../page_content/jurisdiction_overrides/alameda/jurisdiction-site-notice"
import { JursidictionSiteNotice as SanMateoNotice } from "../page_content/jurisdiction_overrides/san_mateo/jurisdiction-site-notice"
import { Message } from "@bloom-housing/ui-seeds"
import { SiteHeader, MenuLink, t, setSiteAlertMessage } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import styles from "./application.module.scss"

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
      href: "/listings",
    },
  ]
  if (process.env.housingCounselorServiceUrl) {
    menuLinks.push({
      title: t("pageTitle.getAssistance"),
      href: process.env.housingCounselorServiceUrl,
    })
  }
  if (profile) {
    menuLinks.push({
      title: t("nav.myAccount"),
      subMenuLinks: [
        {
          title: t("nav.myDashboard"),
          href: "/account/dashboard",
        },
        {
          title: t("account.myApplications"),
          href: "/account/applications",
        },
        {
          title: t("account.accountSettings"),
          href: "/account/edit",
        },
        {
          title: t("nav.signOut"),
          onClick: () => {
            const signOutFxn = async () => {
              setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
              await router.push("/sign-in")
              signOut()
            }
            void signOutFxn()
          },
        },
      ],
    })
  } else {
    menuLinks.push({
      title: t("nav.signIn"),
      href: "/sign-in",
    })
  }
  const getInMaintenance = () => {
    let inMaintenance = false
    const maintenanceWindow = process.env.maintenanceWindow?.split(",")
    if (maintenanceWindow?.length === 2) {
      const convertWindowToDate = (windowString: string) =>
        dayjs(windowString, "YYYY-MM-DD HH:mm Z")
      const startWindow = convertWindowToDate(maintenanceWindow[0])
      const endWindow = convertWindowToDate(maintenanceWindow[1])
      const now = dayjs()
      inMaintenance = now > startWindow && now < endWindow
    }
    return inMaintenance
  }

  let siteNotice = <div></div>
  if (process.env.jurisdictionName === "Alameda") {
    siteNotice = <AlamedaNotice />
  }
  if (process.env.jurisdictionName === "San Jose") {
    siteNotice = <SanJoseNotice />
  }
  if (process.env.jurisdictionName === "San Mateo") {
    siteNotice = <SanMateoNotice />
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        {getInMaintenance() && (
          <div className={styles["site-alert-banner-container"]}>
            <Message className={styles["site-alert-banner-content"]} variant={"alert"}>
              {t("alert.maintenance")}
            </Message>
          </div>
        )}
        <SiteHeader
          logoSrc="/images/logo_glyph.svg"
          homeURL="/"
          notice={siteNotice}
          mainContentId="main-content"
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
          logoWidth={"base"}
          strings={{ skipToMainContent: t("t.skipToMainContent") }}
        />
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>

      {process.env.jurisdictionName === "Alameda" && <AlamedaFooter />}
      {process.env.jurisdictionName === "San Mateo" && <SanMateoFooter />}
      {process.env.jurisdictionName === "San Jose" && <SanJoseFooter />}
    </div>
  )
}

export default Layout
