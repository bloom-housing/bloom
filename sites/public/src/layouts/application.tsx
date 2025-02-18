import React, { useContext } from "react"
import Markdown from "markdown-to-jsx"
import { useRouter } from "next/router"
import Head from "next/head"
import { Toast } from "@bloom-housing/ui-seeds"
import { MenuLink, t } from "@bloom-housing/ui-components"
import { AlertBanner, AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { SiteHeader } from "@bloom-housing/doorway-ui-components/src/headers/SiteHeader"
import CustomSiteFooter from "../components/shared/CustomSiteFooter"

interface LayoutProps {
  children?: React.ReactNode
  hideFooter?: boolean
}

const Layout = (props: LayoutProps) => {
  const { profile, signOut } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()

  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  const menuLinks: MenuLink[] = [
    {
      title: t("pageTitle.welcome"),
      href: "/",
    },
    {
      title: t("nav.viewListings"),
      href: "/listings",
    },
    {
      title: t("nav.helpCenter"),
      href: "#",
      subMenuLinks: [
        {
          title: t("pageTitle.getStarted"),
          href: "/help/get-started",
        },
        {
          title: t("pageTitle.housingHelp"),
          href: "/help/housing-help",
        },
        {
          title: t("pageTitle.questions"),
          href: "/help/questions",
        },
      ],
    },
  ]
  if (process.env.housingCounselorServiceUrl) {
    menuLinks.push({
      title: t("pageTitle.getAssistance"),
      href: process.env.housingCounselorServiceUrl,
    })
  }
  if (process.env.showProfessionalPartners) {
    menuLinks.push({
      title: t("nav.professionalPartners"),
      href: "#",
      subMenuLinks: [
        {
          title: t("pageTitle.developersAndPropertyManagers"),
          href: "/professional-partners/developers-and-property-managers",
        },
        {
          title: t("pageTitle.jurisdictions"),
          href: "/professional-partners/jurisdictions",
        },
      ],
    })
  }
  if (process.env.showMandatedAccounts) {
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
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        {/* temporary change to infra maintenance, should return to alert.maintenance after window */}
        <AlertBanner maintenanceWindow={process.env.maintenanceWindow} variant={"primary"}>
          <Markdown>{t("alert.infraMaintenance")}</Markdown>
        </AlertBanner>
        <SiteHeader
          logoSrc="/images/doorway-logo.png"
          homeURL="/"
          mainContentId="main-content"
          languages={languages?.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks.map((menuLink) => {
            return {
              ...menuLink,
              className:
                router.pathname === menuLink.href ||
                menuLink.subMenuLinks?.map((link) => link.href).indexOf(router.pathname) >= 0
                  ? "secondary"
                  : "",
            }
          })}
          strings={{ skipToMainContent: t("t.skipToMainContent") }}
        />
        <main id="main-content" className="md:overflow-x-hidden relative">
          {toastMessagesRef.current?.map((toastMessage) => (
            <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
              {toastMessage.message}
            </Toast>
          ))}
          {props.children}
        </main>
      </div>
      {!props.hideFooter && <CustomSiteFooter />}
    </div>
  )
}

export default Layout
