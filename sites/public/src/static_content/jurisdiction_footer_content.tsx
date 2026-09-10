import { t } from "@bloom-housing/ui-components"
import { FooterContent, FooterLinks } from "./generic_footer_content"
import { Link } from "@bloom-housing/ui-seeds"

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
  }
}

export const getJurisdictionFooterLinksContent = (): FooterLinks => {
  const currentYear = new Date().getFullYear()
  return {
    links: [],
    cityString: t("footer.copyright", { year: currentYear }),
  }
}
