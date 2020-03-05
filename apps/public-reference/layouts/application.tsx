import React, { Component } from "react"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import LocalizedLink from "@bloom-housing/ui-components/src/atoms/LocalizedLink"
import SiteHeader from "@bloom-housing/ui-components/src/headers/SiteHeader/SiteHeader"
import SiteFooter from "@bloom-housing/ui-components/src/footers/SiteFooter/SiteFooter"
import SVG from "react-inlinesvg"
import FooterNav from "@bloom-housing/ui-components/src/footers/FooterNav/FooterNav"
import FooterSection from "@bloom-housing/ui-components/src/footers/FooterSection/FooterSection"
import ExygyFooter from "@bloom-housing/ui-components/src/footers/ExygyFooter"

export default class extends Component {
  public componentDidMount() {
    //    console.log("DOING A THING!")
  }

  public render() {
    return (
      <div>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <SiteHeader
          logoSrc="/images/logo_glyph.svg"
          notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
          title={t("nav.siteTitle")}
        >
          <LocalizedLink href="/listings" className="navbar-item">
            {t("nav.listings")}
          </LocalizedLink>
          {/* Only show Get Assistance if housing counselor data is available */}
          {process.env.housingCounselorServiceUrl && (
            <LocalizedLink href="/housing-counselors" className="navbar-item">
              {t("nav.getAssistance")}
            </LocalizedLink>
          )}
        </SiteHeader>
        <main>{this.props.children}</main>

        <SiteFooter>
          <FooterNav copyright="Alameda County © 2020 • All Rights Reserved">
            <LocalizedLink href="#">Policy</LocalizedLink>
            <LocalizedLink href="/disclaimer">Disclaimer</LocalizedLink>
          </FooterNav>
          <FooterSection className="bg-black" small>
            <ExygyFooter />
          </FooterSection>
        </SiteFooter>
        <SVG src="/images/icons.svg" />
      </div>
    )
  }
}
