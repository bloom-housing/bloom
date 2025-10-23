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
  LocalizedLink,
} from "@bloom-housing/ui-components"
import { AuthContext, ExygyFooter, MessageContext } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"

const Layout = (props) => {
  const { profile, signOut } = useContext(AuthContext)
  const { toastMessagesRef, addToast } = useContext(MessageContext)
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const copyRight = `Copyright @ ${currentYear} Bay Area Housing Finance Authority. All rights reserved `
  const doorwayPartnersManualLink =
    "https://docs.google.com/document/d/1W4tIMtUMwz4KqdcO5f4yZi0R5AU74P3B/edit"
  const privacyPolicyLink = "https://mtc.ca.gov/doorway-housing-portal-privacy-policy"
  const termsOfUseLink = "https://mtc.ca.gov/doorway-housing-portal-terms-use"
  const menuLinks: MenuLink[] = []
  if (profile) {
    menuLinks.push({
      title: t("nav.listings"),
      href: "/",
    })
  }
  if (profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin) {
    menuLinks.push({
      title: t("nav.users"),
      href: "/users",
    })
  }
  if (
    profile?.jurisdictions?.some((jurisdiction) => !!jurisdiction.enablePartnerSettings) &&
    (profile?.userRoles?.isAdmin ||
      profile?.userRoles?.isJurisdictionalAdmin ||
      profile?.userRoles?.isLimitedJurisdictionalAdmin)
  ) {
    menuLinks.push({
      title: t("t.settings"),
      href: "/settings",
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
          imageOnly={true}
          logoSrc="/images/doorway-logo-partners.svg"
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
          <FooterNav copyright={copyRight}>
            <LocalizedLink href={doorwayPartnersManualLink}>Doorway Partners Manual</LocalizedLink>
            <LocalizedLink href={privacyPolicyLink}>Privacy Policy</LocalizedLink>
            <LocalizedLink href={termsOfUseLink}>Terms of Use</LocalizedLink>
          </FooterNav>
          <FooterSection className="bg-black" small>
            <ExygyFooter />
          </FooterSection>
        </SiteFooter>
      </div>
    </div>
  )
}

export default Layout
