import {
  FooterNav,
  FooterSection,
  LocalizedLink,
  SiteFooter,
  t,
} from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"
import { getJurisdictionFooterLinksContent } from "../../static_content/jurisdiction_footer_content"

type PartnerFooterLink = {
  href: string
  text: string
}

export type PartnerFooterProps = {
  links: PartnerFooterLink[]
  includeExygyFooter: boolean
}

const PartnersFooter = () => {
  const footerContent: PartnerFooterProps = getJurisdictionFooterLinksContent()
  const currentYear = new Date().getFullYear()
  return (
    <SiteFooter>
      <FooterNav copyright={t("footer.copyright", { year: currentYear })}>
        {footerContent.links.map((footerLink) => (
          <LocalizedLink key={footerLink.text} href={footerLink.href}>
            {footerLink.text}
          </LocalizedLink>
        ))}
      </FooterNav>
      {footerContent.includeExygyFooter && (
        <FooterSection className="bg-black" small>
          <ExygyFooter />
        </FooterSection>
      )}
    </SiteFooter>
  )
}

export default PartnersFooter
