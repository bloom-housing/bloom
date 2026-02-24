import { t } from "@bloom-housing/ui-components"
import { FooterContent, FooterLinks } from "./generic_footer_content"

export const getJurisdictionFooterTextContent = (): FooterContent => {
  return {
    textSections: [
      <>
        <p>
          The Affordable and Accessible Housing Registry is a project of the City of Los Angeles
          Housing Department (LAHD). For listing and application questions, please contact the
          Leasing Agent displayed on the listing. For general program inquiries, you may visit our
          website at{" "}
          <a href="https://lahousing.lacity.org/AAHR/">https://lahousing.lacity.org/AAHR/</a> or
          email <a href="mailto:lahd.achp@lacity.org">lahd.achp@lacity.org</a>. You may also call
          our hotline at <a href="tel:2138088550">(213) 808-8550</a>.
        </p>
      </>,
      <>
        <p>
          TTY: Due to technological changes, if TTY is needed to contact us, please use
          Telecommunication Relay Services (TRS) such as Text-to-Voice TTY-based TRS,
          Speech-to-Speech Relay Service, Shared Non-English Language Relay Services, Captioned
          Telephone Service; IP Captioned Telephone Service, Internet Protocol Relay Service, or
          Video Relay Service or dial 711.
        </p>
      </>,
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
