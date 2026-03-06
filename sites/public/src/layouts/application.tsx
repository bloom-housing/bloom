import React, { useContext, useEffect, useState } from "react"
import dayjs from "dayjs"
import { NextRouter, useRouter } from "next/router"
import Markdown from "markdown-to-jsx"
import Head from "next/head"
import HomeIcon from "@heroicons/react/24/solid/HomeIcon"
import { Message, Toast, Icon } from "@bloom-housing/ui-seeds"
import { MenuLink, t, SiteHeader as UICSiteHeader } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ToastProps } from "@bloom-housing/ui-seeds/src/blocks/Toast"
import { MetaTags } from "../components/shared/MetaTags"
import CustomSiteFooter from "../components/shared/CustomSiteFooter"
import { HeaderLink, SiteHeader } from "../patterns/SiteHeader"
import styles from "./application.module.scss"

const isMessageActive = (windowEnv: string) => {
  let isActive = false
  const messageWindow = windowEnv?.split(",")
  if (messageWindow?.length === 2) {
    const convertWindowToDate = (windowString: string) => dayjs(windowString, "YYYY-MM-DD HH:mm Z")
    const startWindow = convertWindowToDate(messageWindow[0])
    const endWindow = convertWindowToDate(messageWindow[1])
    const now = dayjs()
    isActive = now > startWindow && now < endWindow
  }
  return isActive
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
  showGenericSiteMessage: boolean,
  showMaintenanceMessage: boolean
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

  return (
    <>
      {showMaintenanceMessage && (
        <div className={`${styles["site-banner-container"]} ${styles["site-banner-alert-bg"]}`}>
          <Message className={styles["site-alert-banner-content"]} variant={"alert"}>
            <Markdown>{t("alert.maintenance")}</Markdown>
          </Message>
        </div>
      )}
      {showGenericSiteMessage && (
        <div className={`${styles["site-banner-container"]} ${styles["site-banner-primary-bg"]}`}>
          <Message className={styles["site-alert-banner-content"]} variant={"primary"}>
            <Markdown>{t("siteMessage.generic")}</Markdown>
          </Message>
        </div>
      )}
      <UICSiteHeader
        logoSrc="/images/logo_glyph.svg"
        homeURL="/"
        notice={
          <a href="/" target="_blank" className={"cursor-pointer"}>
            {t("nav.getFeedback")}
          </a>
        }
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
  linksBehindFlags: Record<string, boolean>
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
        ...(linksBehindFlags["applications"]
          ? [
              {
                label: t("account.myApplications"),
                href: "/account/applications",
              },
            ]
          : []),
        ...(linksBehindFlags["favorites"]
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

interface LayoutProps {
  children: React.ReactNode
  metaDescription?: string
  metaImage?: string
  noIndex?: boolean
  pageTitle?: string
}

const Layout = (props: LayoutProps) => {
  const { profile, signOut } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()

  const [showFavorites, setShowFavorites] = useState(false)
  const [showApplications, setShowApplications] = useState(true)

  useEffect(() => {
    setShowFavorites(window.localStorage.getItem("bloom-show-favorites-menu-item") === "true")
    setShowApplications(window.localStorage.getItem("bloom-hide-applications-menu-item") !== "true")
  }, [setShowFavorites, setShowApplications])

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>
            {props.pageTitle ? `${props.pageTitle} - ${t("nav.siteTitle")}` : t("nav.siteTitle")}
          </title>
          {props.noIndex && <meta name="robots" content="noindex, follow" />}
          {props.pageTitle && (
            <MetaTags
              title={props.pageTitle}
              description={props.metaDescription ?? ""}
              image={props.metaImage ?? ""}
            />
          )}
        </Head>
        {process.env.showNewSeedsDesigns ? (
          <SiteHeader
            title={t("nav.siteTitle")}
            languageDropdown={true}
            languages={languages?.map((lang) => {
              return {
                label: lang.label,
                onClick: () =>
                  void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
                active: t("config.routePrefix") === lang.prefix,
              }
            })}
            links={getHeaderLinks(router, profile, signOut, addToast, {
              applications: showApplications,
              favorites: showFavorites,
            })}
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
          getSiteHeaderDeprecated(
            router,
            profile,
            signOut,
            addToast,
            languages,
            isMessageActive(process.env.siteMessageWindow),
            isMessageActive(process.env.maintenanceWindow)
          )
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

      <CustomSiteFooter />
    </div>
  )
}

export default Layout
