import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import { SiteFooter, FooterNav, FooterSection, t } from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"
import { getSiteHeader } from "../lib/helpers"

const Layout = (props) => {
  const router = useRouter()
  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        {getSiteHeader(router)}
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>

      <SiteFooter>
        <FooterNav copyright={t("footer.copyright")}>
          <Link href="/privacy">{t("pageTitle.privacy")}</Link>
          <Link href="/disclaimer">{t("pageTitle.disclaimer")}</Link>
        </FooterNav>
        <FooterSection className="bg-black" small>
          <ExygyFooter />
        </FooterSection>
      </SiteFooter>
    </div>
  )
}

export default Layout
