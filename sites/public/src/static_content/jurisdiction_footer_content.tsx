import { t } from "@bloom-housing/ui-components"
import { FooterContent, FooterLinks } from "./generic_footer_content"
import { Link } from "@bloom-housing/ui-seeds"
import { SocialLinkType } from "./generic_footer_content"

export const getJurisdictionFooterTextContent = (): FooterContent => {
  return {
    textSections: [
      <>
        <div style={{ color: "white" }}>{t("footer.content.projectOf")}</div>
        <div>{t("footer.content.bahfa")}</div>
      </>,
      <Link href={"https://mtc.ca.gov/contact-doorway"}>{t("footer.content.contact")}</Link>,
      <Link href={"https://mtc.ca.gov/doorway-housing-portal-privacy-policy"}>
        {t("pageTitle.privacy")}
      </Link>,
      <Link href={"https://mtc.ca.gov/doorway-housing-portal-terms-use"}>
        {t("pageTitle.termsOfUse")}
      </Link>,
      <Link href={"https://mtc.ca.gov/bahfa-non-discrimination-statement"}>
        {t("pageTitle.bahfaNonDiscriminationStatement")}
      </Link>,
      <Link href={"https://mtc.ca.gov/about-mtc/public-participation/language-assistance"}>
        {t("pageTitle.languageAssistance")}
      </Link>,
      <Link href={"https://mtc.ca.gov/doorway-housing-portal-accessibility-statement"}>
        {t("pageTitle.accessibilityStatement")}
      </Link>,
    ],
    logo: {
      logoSrc: "/images/bahfa-logo.png",
      logoAltText: "BAHFA Logo",
      logoUrl: "https://mtc.ca.gov/about-mtc/authorities/bay-area-housing-finance-authority-bahfa",
    },
    socialLinks: [
      {
        icon: SocialLinkType.X,
        href: "https://twitter.com/mtcbata",
      },
      {
        icon: SocialLinkType.LinkedIn,
        href: "https://www.linkedin.com/company/metropolitan-transportation-commission",
      },
      {
        icon: SocialLinkType.Facebook,
        href: "https://www.facebook.com/MTCBATA",
      },
      {
        icon: SocialLinkType.YouTube,
        href: "https://www.youtube.com/user/mtcabaglibrary",
      },
      {
        icon: SocialLinkType.Instagram,
        href: "https://www.instagram.com/mtcbata",
      },
    ],
  }
}

export const getJurisdictionFooterLinksContent = (): FooterLinks => {
  const currentYear = new Date().getFullYear()
  return {
    links: [],
    cityString: t("footer.copyright", { year: currentYear }),
    equalHousingOpportunity: true,
  }
}
