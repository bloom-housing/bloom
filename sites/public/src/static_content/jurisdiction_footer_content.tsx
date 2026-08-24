import { t } from "@bloom-housing/ui-components"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { StoredHtml } from "../components/shared/StoredHtml"
import { asList, hasText } from "./contentHelpers"
import { FooterContent, FooterLinks } from "./generic_footer_content"

export const getJurisdictionFooterTextContent = (
  content?: JurisdictionContentFields | null
): FooterContent | null => {
  const footer = content?.footer
  const textSections = asList(footer?.textSectionsHtml)
    .filter(hasText)
    .map((section, index) => <StoredHtml key={index} html={section} />)

  // A logo is the image; without one there is nothing to show, whatever the other fields say.
  const logo = hasText(footer?.logo?.logoSrc)
    ? {
        logoSrc: footer.logo.logoSrc,
        logoAltText: footer.logo.logoAltText,
        logoUrl: footer.logo.logoUrl,
      }
    : undefined

  if (!textSections.length && !logo) return null

  return { textSections, logo }
}

export const getJurisdictionFooterLinksContent = (
  content?: JurisdictionContentFields | null
): FooterLinks | null => {
  const links = asList(content?.footer?.links)
    .filter((link) => hasText(link.text) && hasText(link.href))
    .map((link) => ({ text: link.text, href: link.href }))

  if (!links.length) return null

  // The stored document has no copyright line, so it keeps coming from the locale files.
  return { links, cityString: t("footer.copyright") }
}
