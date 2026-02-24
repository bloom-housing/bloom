import { t } from "@bloom-housing/ui-components"
import { FooterContent, FooterLinks } from "./generic_footer_content"
import Markdown from "markdown-to-jsx"

export const getJurisdictionFooterTextContent = (): FooterContent => {
  return {
    textSections: [
      <Markdown>{t("footer.content1")}</Markdown>,
      <Markdown>{t("footer.content2")}</Markdown>,
    ],
    logo: {
      logoSrc: "/images/la-logo-grayscale.svg",
      logoAltText: "Jurisdiction Logo",
      logoUrl: "/",
    },
  }
}

export const getJurisdictionFooterLinksContent = (): FooterLinks => {
  return {
    links: [
      { text: t("pageTitle.termsAndConditions"), href: "/" },
      { text: t("pageTitle.accessibilityStatement"), href: "/" },
      { text: t("pageTitle.privacy"), href: "https://housing.lacity.gov/about-us/privacy-policy" },
    ],
    cityString: t("footer.copyright"),
  }
}
