import { t } from "@bloom-housing/ui-components"
import { FooterContent, FooterLinks } from "./generic_footer_content"
import Markdown from "markdown-to-jsx"

export const getJurisdictionFooterTextContent = (): FooterContent => {
  return {
    // todo: figure out how to
    textSections: [
      <div>
        <Markdown>{t("footer.address1")}</Markdown>
        <br />
        <Markdown>{t("footer.address2")}</Markdown>
        <br />
        <Markdown>{t("footer.mondayToFriday")}</Markdown>
        <br />
        <a href="mailto: doorway@bayareametro.gov" className="underline">
          doorway@bayareametro.gov
        </a>
      </div>,
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
    links: [
      {
        text: t("pageTitle.privacy"),
        href: "https://mtc.ca.gov/doorway-housing-portal-privacy-policy",
      },
      {
        text: t("pageTitle.termsOfUse"),
        href: "https://mtc.ca.gov/doorway-housing-portal-terms-use",
      },
      {
        text: t("pageTitle.bahfaNonDiscriminationStatement"),
        href: "https://mtc.ca.gov/bahfa-non-discrimination-statement",
      },
      {
        text: t("pageTitle.languageAssistance"),
        href: "https://mtc.ca.gov/about-mtc/public-participation/language-assistance",
      },
      {
        text: t("pageTitle.accessibilityStatement"),
        href: "https://mtc.ca.gov/doorway-housing-portal-accessibility-statement",
      },
    ],
    cityString: t("footer.copyright", { year: currentYear }),
  }
}
