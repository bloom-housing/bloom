import React, { useContext } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { MenuLink, t, setSiteAlertMessage } from "@bloom-housing/ui-components"
import { SiteHeader } from "@bloom-housing/doorway-ui-components"

import { AuthContext } from "@bloom-housing/shared-helpers"

const LayoutWithoutFooter = (props) => {
  const { profile, signOut } = useContext(AuthContext)
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
      className: "secondary",
    },
    {
      title: t("nav.browseAllListings"),
      href: "/listings",
    },
    {
      title: t("nav.helpCenter"),
      href: "#",
      subMenuLinks: [
        {
          title: "item 1 temp",
          href: "?temp1",
        },
        {
          title: "item 2 temp",
          href: "?temp2",
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
    // TODO: Uncomment when applications are re-enabled
    // menuLinks.push({
    //   title: t("nav.signIn"),
    //   href: "/sign-in",
    // })
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          logoSrc="/images/doorway_logo_temp.png"
          homeURL="/"
          mainContentId="main-content"
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks}
          logoWidth={"base_expanded"}
          strings={{ skipToMainContent: t("t.skipToMainContent") }}
        />
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>
    </div>
  )
}

export default LayoutWithoutFooter
