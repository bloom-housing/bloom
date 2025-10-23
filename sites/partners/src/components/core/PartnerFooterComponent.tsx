import { FooterNav, FooterSection, LocalizedLink, SiteFooter } from "@bloom-housing/ui-components"
import { ExygyFooter } from "@bloom-housing/shared-helpers"

type PartnerFooterLink = {
  hrerf: string
  text: string
}

export type PartnerFooterProps = {
  copyRight: string
  links: PartnerFooterLink[]
}

const PartnersFooter = (props: PartnerFooterProps) => {
  return (
    <SiteFooter>
      <FooterNav copyright={props.copyRight}>
        {props.links.map((footerLik) => (
          <LocalizedLink href={footerLik.hrerf}>{footerLik.text}</LocalizedLink>
        ))}
      </FooterNav>
      <FooterSection className="bg-black" small>
        <ExygyFooter />
      </FooterSection>
    </SiteFooter>
  )
}

export default PartnersFooter
