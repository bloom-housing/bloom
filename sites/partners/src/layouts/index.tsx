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
} from "@bloom-housing/ui-components"
import { AuthContext, ExygyFooter, MessageContext } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const Layout = (props) => {
  const { profile, signOut, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const menuLinks: MenuLink[] = []
  if (profile) {
    menuLinks.push({
      title: t("nav.listings"),
      href: "/",
    })

    if (process.env.enableHousingReports) {
      // Add Data Explorer menu item
      menuLinks.push({
        title: "Explore Data",
        href: "/explore",
      })
    }
  }
  if (profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin) {
    menuLinks.push({
      title: t("nav.users"),
      href: "/users",
    })
  }
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )

  if (
    profile?.jurisdictions?.some((jurisdiction) => !!jurisdiction.enablePartnerSettings) &&
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      profile?.userRoles?.isLimitedJurisdictionalAdmin) &&
    (enableProperties || atLeastOneJurisdictionEnablesPreferences)
  ) {
    menuLinks.push({
      title: t("t.settings"),
      href: atLeastOneJurisdictionEnablesPreferences
        ? "/settings/preferences"
        : "/settings/properties",
    })
  }
  if (profile) {
    menuLinks.push({
      title: t("nav.signOut"),
      onClick: async () => {
        await router.push("/sign-in")
        await signOut()
        addToast(t(`authentication.signOut.success`), { variant: "primary" })
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
        <main>
          {toastMessagesRef.current?.map((toastMessage) => (
            <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
              {toastMessage.message}
            </Toast>
          ))}
          {props.children}
        </main>
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
