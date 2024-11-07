import React from "react"
import { FooterNav, FooterSection, SiteFooter, t } from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Link from "next/link"
import { useRouter } from "next/router"

export interface FooterProps {
  locale?: string
}

const feedbackLink = (locale: string) => {
  switch (locale) {
    case LanguagesEnum.es:
      return "https://docs.google.com/forms/d/e/1FAIpQLScmOWY8qR92vfJbPq6uCgIVW25N_D_u4RF-hwZ17NvprNgqkw/viewform"
    case LanguagesEnum.vi:
      return "https://docs.google.com/forms/d/e/1FAIpQLScCANRADZxFT7l0BiHVNifLXWeSstNmaNXqlfpy53jtxF8gxg/viewform"
    case LanguagesEnum.zh:
      return "https://docs.google.com/forms/d/e/1FAIpQLSedEJqjP3MtArBrhDwUTAY8jSCTLsIsKVV_i3tMk9EK59XOew/viewform"
    default:
      return "https://docs.google.com/forms/d/e/1FAIpQLScAZrM-4biqpQPFSJfaYef0dIiONYJ95n8pK1c8a5a8I78xxw/viewform"
  }
}

export const JurisdictionFooterSection = () => {
  const router = useRouter()

  return (
    <SiteFooter>
      <FooterSection>
        <img src="/images/san-jose-logo-white.png" alt="San José" />
      </FooterSection>
      <FooterSection>
        <p>{t("footer.header")}</p>
        <p className="mt-10 text-sm">{t("footer.forListingQuestions")}</p>
        <p className="text-sm">{t("footer.forGeneralInquiries")}</p>
        <p className="mt-10 text-sm">
          {t("footer.forAdditionalOpportunities")}
          <br />
          <a className="px-2" href={process.env.doorwayUrl} target="_blank" rel="noreferrer">
            {t("footer.DoorwayHousingPortal")}
          </a>
          |
          <a className="px-2" href={t("footer.SFHousingUrl")} target="_blank" rel="noreferrer">
            {t("footer.SFHousingPortal")}
          </a>
          |
          <a className="px-2" href="https://housing.acgov.org/" target="_blank" rel="noreferrer">
            {t("footer.ACPortal")}
          </a>
        </p>
      </FooterSection>
      <FooterSection>
        <img
          className="h-16 w-16"
          src="/images/eho-logo-white.svg"
          alt="Equal Housing Opportunity Logo"
        />
      </FooterSection>
      <FooterNav copyright={t("footer.copyRight")}>
        <a href={feedbackLink(router.locale)} target="_blank" rel="noreferrer">
          {t("footer.giveFeedback")}
        </a>
        <a href="mailto:SJHousingPortal@sanjoseca.gov">{t("footer.contact")}</a>
        <Link href="/disclaimer">{t("footer.disclaimer")}</Link>
        <Link href="/privacy">{t("footer.privacyPolicy")}</Link>
      </FooterNav>
      <FooterSection className="bg-black" small>
        <ExygyFooter />
      </FooterSection>
    </SiteFooter>
  )
}
