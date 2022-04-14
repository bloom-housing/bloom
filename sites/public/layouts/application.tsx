import React, { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import {
  SiteHeader,
  SiteFooter,
  FooterNav,
  FooterSection,
  ExygyFooter,
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
          title: t("account.accountSettings"),
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
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>

      <SiteFooter>
        <div className="footer-sections">
          <div className="footer-logo">
            <h2 className="sr-only">{t("footer.srHeading")}</h2>
            <FooterSection small={true}>
              <div className="flex justify-center pb-7">
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
            </FooterSection>
          </div>
          <div className="footer-info">
            <FooterSection small={true} className="footer-info__column">
              <div className="flex flex-col justify-center px-4 text-white">
                <h5 className="text-sm font-bold text-left mb-3">
                  {t("footer.forListingQuestions")}
                </h5>
                <p className="text-sm text-left">{t("footer.pleaseContact")}</p>
              </div>
            </FooterSection>
            <FooterSection small={true} className="footer-info__column">
              <div className="flex flex-col justify-center px-4 text-white">
                <h5 className="text-sm font-bold text-left mb-3">
                  {t("footer.forGeneralInquiries")}
                </h5>
                <p className="text-sm text-left">
                  {t("footer.youMayCall")}{" "}
                  <a className="font-bold" href="tel:313-224-6380">
                    (313) 224-6380
                  </a>
                </p>
              </div>
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
        <FooterSection className="bg-black" small>
          <ExygyFooter />
        </FooterSection>
      </SiteFooter>
    </div>
  )
}

export default Layout
