import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
  // UserNav,
  t,
  // AuthContext,
  // setSiteAlertMessage,
} from "@bloom-housing/ui-components"

const Layout = (props) => {
  // const { profile, signOut } = useContext(AuthContext)
  const router = useRouter()

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
        <SiteHeader
          logoSrc="/images/logo_glyph.svg"
          notice={
            <>
              {`${t("nav.getFeedback")} `}
              <a href="" target="_blank" className={"cursor-pointer"}>
                {t("nav.getFeedbackLink")}
              </a>
            </>
          }
          title={t("nav.siteTitle")}
          language={{
            list: languages,
            codes: router?.locales,
          }}
          menuLinks={[
            {
              title: t("nav.listings"),
              href: "/listings",
            },
            {
              title: t("nav.getAssistance"),
              href: "/housing-counselors",
            },
            {
              title: "Sign In",
              subMenuLinks: [
                {
                  title: t("nav.myDashboard"),
                  href: "/account/dashboard",
                },
                {
                  title: t("nav.myApplications"),
                  href: "/account/dashboard",
                },
                {
                  title: t("nav.accountSettings"),
                  href: "/account/edit",
                },
              ],
            },
          ]}
        />
        {/* <Link href="/listings">
            <a className="navbar-item">{t("nav.listings")}</a>
          </Link>

          {process.env.housingCounselorServiceUrl && ( // Only show Get Assistance if housing counselor data is available
            <Link href="/housing-counselors">
              <a className="navbar-item">{t("nav.getAssistance")}</a>
            </Link>
          )}
          <UserNav
            signedIn={!!profile}
            signOut={async () => {
              setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
              await router.push("/sign-in")
              signOut()
            }}
          >
            <Link href="/account/dashboard">
              <a className="navbar-item">{t("nav.myDashboard")}</a>
            </Link>
            <Link href="/account/applications">
              <a className="navbar-item">{t("nav.myApplications")}</a>
            </Link>
            <Link href="/account/edit">
              <a className="navbar-item">{t("nav.accountSettings")}</a>
            </Link>
          </UserNav> */}
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
