import React, { useContext, useEffect, useState } from "react"
import dayjs from "dayjs"
import { NextRouter, useRouter } from "next/router"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import HomeIcon from "@heroicons/react/24/solid/HomeIcon"
import { JurisdictionFooterSection as SanMateoFooter } from "../page_content/jurisdiction_overrides/san_mateo/jurisdiction-footer-section"
import { JurisdictionFooterSection as SanJoseFooter } from "../page_content/jurisdiction_overrides/san_jose/JurisdictionFooterSection"
import { JurisdictionFooterSection as AlamedaFooter } from "../page_content/jurisdiction_overrides/alameda/JurisdictionFooterSection"
import { JursidictionSiteNotice as SanJoseNotice } from "../page_content/jurisdiction_overrides/san_jose/jurisdiction-site-notice"
import { Message, Toast, Icon } from "@bloom-housing/ui-seeds"
import { MenuLink, t, SiteHeader as UICSiteHeader } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { HeaderLink, SiteHeader } from "../patterns/SiteHeader"
import styles from "./application.module.scss"
import { User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"

const getInMaintenance = () => {
  let inMaintenance = false
  const maintenanceWindow = process.env.maintenanceWindow?.split(",")
  if (maintenanceWindow?.length === 2) {
    const convertWindowToDate = (windowString: string) => dayjs(windowString, "YYYY-MM-DD HH:mm Z")
    const startWindow = convertWindowToDate(maintenanceWindow[0])
    const endWindow = convertWindowToDate(maintenanceWindow[1])
    const now = dayjs()
    inMaintenance = now > startWindow && now < endWindow
  }
  return inMaintenance
}

const getSiteHeaderDeprecated = (
  router: NextRouter,
  profile: User,
  signOut: () => Promise<void>,
  addToast: (message: string, props: ToastProps) => void,
  languages: {
    prefix: string
    label: string
  }[],
  inMaintenance: boolean
) => {
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
              await router.push("/sign-in")
              await signOut()
              addToast(t(`authentication.signOut.success`), { variant: "primary" })
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

  let siteNotice = <div></div>
  let transitionMessage = null
  if (process.env.jurisdictionName === "Alameda") {
    transitionMessage = t("alert.transitionv3")
  }
  if (process.env.jurisdictionName === "San Jose") {
    siteNotice = <SanJoseNotice />
  }
  if (process.env.jurisdictionName === "San Mateo") {
    transitionMessage = t("alert.transitionv2")
  }

  return (
    <>
      {transitionMessage && (
        <div className={styles["site-alert-banner-container"]}>
          <Message className={styles["site-alert-banner-content"]} variant={"primary"}>
            <Markdown>{transitionMessage}</Markdown>
          </Message>
        </div>
      )}
      {inMaintenance && (
        <div className={styles["site-alert-banner-container"]}>
          <Message className={styles["site-alert-banner-content"]} variant={"alert"}>
            {t("alert.maintenance")}
          </Message>
        </div>
      )}
      <UICSiteHeader
        logoSrc="/images/logo_glyph.svg"
        homeURL="/"
        notice={siteNotice}
        mainContentId="main-content"
        title={t("nav.siteTitle")}
        languages={languages?.map((lang) => {
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
    </>
  )
}

const getHeaderLinks = (
  router: NextRouter,
  profile: User,
  signOut: () => Promise<void>,
  addToast: (message: string, props: ToastProps) => void,
  showFavorites: boolean
) => {
  const headerLinks: HeaderLink[] = [
    {
      label: t("nav.listings"),
      href: "/listings",
    },
  ]
  if (process.env.housingCounselorServiceUrl) {
    headerLinks.push({
      label: t("pageTitle.getAssistance"),
      href: process.env.housingCounselorServiceUrl,
    })
  }
  if (profile) {
    headerLinks.push({
      label: t("nav.myAccount"),
      submenuLinks: [
        {
          label: t("nav.myDashboard"),
          href: "/account/dashboard",
        },
        {
          label: t("account.myApplications"),
          href: "/account/applications",
        },
        ...(showFavorites
          ? [
              {
                label: t("account.myFavorites"),
                href: "/account/favorites",
              },
            ]
          : []),
        {
          label: t("account.accountSettings"),
          href: "/account/edit",
        },
        {
          label: t("nav.signOut"),
          onClick: () => {
            const signOutFxn = async () => {
              await router.push("/sign-in")
              await signOut()
              addToast(t(`authentication.signOut.success`), { variant: "primary" })
            }
            void signOutFxn()
          },
        },
      ],
    })
  } else {
    headerLinks.push({
      label: t("nav.signIn"),
      href: "/sign-in",
    })
  }
  return headerLinks
}

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()

  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem("bloom-show-favorites-menu-item") === "true") {
      setShowFavorites(true)
    }
  }, [setShowFavorites])

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        {process.env.showNewSeedsDesigns ? (
          <SiteHeader
            title={t("nav.siteTitle")}
            languages={languages?.map((lang) => {
              return {
                label: lang.label,
                onClick: () =>
                  void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
                active: t("config.routePrefix") === lang.prefix,
              }
            })}
            links={getHeaderLinks(router, profile, signOut, addToast, showFavorites)}
            titleLink={"/"}
            logo={
              <Icon size={"lg"}>
                <HomeIcon />
              </Icon>
            }
            mainContentId="main-content"
            showMessageBar={true}
          />
        ) : (
          getSiteHeaderDeprecated(router, profile, signOut, addToast, languages, getInMaintenance())
        )}
        <div
          id="main-content"
          tabIndex={-1}
          aria-label={"Main content"}
          className="md:overflow-x-hidden main-container"
        >
          <main>
            {toastMessagesRef.current?.map((toastMessage) => (
              <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
                {toastMessage.message}
              </Toast>
            ))}
            {props.children}
          </main>
        </div>
      </div>

      {process.env.jurisdictionName === "Alameda" && <AlamedaFooter />}
      {process.env.jurisdictionName === "San Mateo" && <SanMateoFooter />}
      {process.env.jurisdictionName === "San Jose" && <SanJoseFooter />}
    </div>
  )
}

export default Layout
