import React from "react"
import { FooterNav, FooterSection, SiteFooter, t } from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"
import Link from "next/link"

export const JurisdictionFooterSection = () => {
  return (
    <SiteFooter>
      <FooterSection>
        <img src="/images/alameda-logo-white.svg" alt="Alameda County" />
      </FooterSection>
      <FooterSection>
        <p>
          {t("footer.header")}
          <br />
          <a href={t("footer.headerUrl")} target="_blank" rel="noreferrer">
            {t("footer.headerLink")}
          </a>
        </p>
        <p className="mt-10 text-sm">{t("footer.forListingQuestions")}</p>
        <p className="text-sm">{t("footer.forGeneralInquiries")}</p>
        <p className="mt-10 text-sm">
          {t("footer.forAdditionalOpportunities")}
          <br />
          {process.env.doorwayUrl && (
            <>
              <a className="px-2" href={process.env.doorwayUrl} target="_blank" rel="noreferrer">
                {t("footer.DoorwayHousingPortal")}
              </a>
              |
            </>
          )}
          <a className="px-2" href={t("footer.SFHousingUrl")} target="_blank" rel="noreferrer">
            {t("footer.SFHousingPortal")}
          </a>
          |
          <a className="px-2" href={t("footer.SJHousingUrl")} target="_blank" rel="noreferrer">
            {t("footer.SJHousingPortal")}
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
      <FooterNav copyright={t("footer.copyright")}>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link"
          target="_blank"
          rel="noreferrer"
        >
          {t("footer.giveFeedback")}
        </a>
        <a href="mailto:achousingportal@edenir.org">{t("footer.contact")}</a>
        <a href="https://www.acgov.org/government/legal.htm" target="_blank" rel="noreferrer">
          {t("footer.disclaimer")}
        </a>
        <Link href="/privacy">{t("footer.privacyPolicy")}</Link>
      </FooterNav>
      <FooterSection className="bg-black" small>
        <ExygyFooter />
      </FooterSection>
    </SiteFooter>
  )
}
