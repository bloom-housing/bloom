import React, { useContext } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isPartnerPortalRole } from "@bloom-housing/shared-helpers/src/utilities/userRoles"
import { SiteHeader, t, MenuLink } from "@bloom-housing/ui-components"
import { Toast } from "@bloom-housing/ui-seeds"
import PartnersFooter from "../components/core/PartnerFooter"

const Layout = (props) => {
  const { profile, doJurisdictionsHaveFeatureFlagOn, signOut } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()
  const menuLinks: MenuLink[] = []

  if (profile && isPartnerPortalRole(profile.userRoles)) {
    const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
      FeatureFlagEnum.disableListingPreferences,
      null,
      true
    )
    const enableAgencies = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate)
    const enablePartnerSettings = profile?.jurisdictions?.some(
      (jurisdiction) => !!jurisdiction.enablePartnerSettings
    )
    const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
    const enableSettings =
      enablePartnerSettings &&
      (atLeastOneJurisdictionEnablesPreferences || enableAgencies || enableProperties)

    menuLinks.push({
      title: t("nav.listings"),
      href: "/",
    })

    if (profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin) {
      menuLinks.push({
        title: t("nav.users"),
        href: "/users",
      })
    }

    if (
      enableSettings &&
      (profile?.userRoles?.isAdmin ||
        profile?.userRoles?.isJurisdictionalAdmin ||
        profile?.userRoles?.isLimitedJurisdictionalAdmin)
    ) {
      menuLinks.push({
        title: t("t.settings"),
        href: atLeastOneJurisdictionEnablesPreferences
          ? "/settings/preferences"
          : "/settings/properties",
      })
    }

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
        <PartnersFooter />
      </div>
    </div>
  )
}

export default Layout
