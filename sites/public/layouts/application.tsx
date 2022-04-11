import React, { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  MenuLink,
  t,
  AuthContext,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"

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
      title: t("nav.rentals"),
      href: "/listings",
    },
    {
      title: t("pageTitle.about"),
      href: "/about",
    },
    {
      title: t("pageTitle.resources"),
      href: "/resources",
    },
  ]
  if (profile) {
    menuLinks.push({
      title: t("nav.myAccount"),
      subMenuLinks: [
        {
          title: t("nav.myDashboard"),
          href: "/account/dashboard",
        },
        {
          title: t("nav.accountSettings"),
          href: "/account/edit",
        },
        {
          title: t("nav.signOut"),
          onClick: async () => {
            setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
            await router.push("/sign-in")
            signOut()
          },
        },
      ],
    })
  } else {
    menuLinks.push({
      title: t("nav.signIn"),
      href: "/sign-in",
      class: "navbar-link__sign-in",
    })
    menuLinks.push({
      title: t("nav.signUp"),
      href: "/create-account",
      class: "navbar-link__sign-up",
    })
  }

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          logoSrc="/images/detroit-logo.png"
          homeURL="/"
          title={t("nav.siteTitle")}
          subtitle="City of Detroit"
          logoWidth={"medium"}
          languages={languages.map((lang) => {
            return {
              label: lang.label,
              onClick: () =>
                void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
              active: t("config.routePrefix") === lang.prefix,
            }
          })}
          menuLinks={menuLinks}
          desktopMinWidth={1024}
        />
        <main id="main-content">{props.children}</main>
      </div>

      <SiteFooter>
        <div className="footer-sections">
          <div className="footer-logo text-white">
            <h2 className="sr-only">{t("footer.srHeading")}</h2>
            <FooterSection small={true}>
              <div className="flex pb-7">
                <img src="/images/detroit-logo-white.png" alt="City of Detroit logo" />
                <div className="flex flex-col justify-center text-white ml-2">
                  <h4 className="text-left text-base font-bold md:text-lg">{t("footer.header")}</h4>
                  <a
                    className="text-left text-xs md:text-base"
                    href="https://detroitmi.gov/departments/housing-and-revitalization-department"
                    target="_blank"
                  >
                    {t("footer.headerLink")}
                  </a>
                </div>
              </div>

              <p className="text-left">Detroit Home Connect is a project of the City of Detroit Housing and Revitalization Department in partnership with Exygy and Google.org.</p>
            </FooterSection>
          </div>
          <div className="footer-info text-white">
            <FooterSection small={true}>
              <h5 className="text-base font-bold text-left mb-3">
                {t("footer.forListingQuestions")}
              </h5>
              <p className="text-left">{t("footer.pleaseContact")}</p>

              <h5 className="text-base font-bold text-left mb-3">
                {t("footer.forGeneralInquiries")}
              </h5>
              <p className="text-left">
                email the City of Detroit Housing and Revitalization Department at <a className="font-bold" href="mailto:detroithomeconnect@detroitmi.gov">detroithomeconnect@detroitmi.gov</a> or call <a className="font-bold" href="tel:313-224-6380">313-224-6380</a>. 
              </p>
            </FooterSection>
          </div>
        </div>
        <FooterNav copyright={t("footer.copyright")}>
          <Link href="/feedback">
            <a>{t("pageTitle.feedback")}</a>
          </Link>
          <Link href="/privacy">
            <a>{t("pageTitle.privacy")}</a>
          </Link>
          <Link href="/disclaimer">
            <a>{t("pageTitle.disclaimer")}</a>
          </Link>
        </FooterNav>
      </SiteFooter>
    </div>
  )
}

export default Layout
