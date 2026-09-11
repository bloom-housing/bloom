import { Link } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"

export enum SocialLinkType {
  Facebook = "facebook",
  X = "x",
  LinkedIn = "linkedin",
  YouTube = "youtube",
  Instagram = "instagram",
}

export type SocialLink = {
  icon: SocialLinkType
  href: string
}

export type FooterContent = {
  textSections: React.ReactNode[]
  logo?: {
    logoSrc: string
    logoAltText?: string
    logoUrl?: string
  }
  socialLinks?: SocialLink[]
}

export type FooterLinks = {
  links: {
    text: string
    href: string
  }[]
  cityString?: string
  equalHousingOpportunity?: boolean
}

export const getGenericFooterTextContent = (): FooterContent => {
  return {
    textSections: [
      <>
        <span>{t("footer.content.projectOf")}</span>{" "}
        <Link href={"/"}>Mayor's Office of Housing Development</Link>{" "}
      </>,
      <>
        <p>{t("footer.content.applicationQuestions")}</p>
        <p>{t("footer.content.programQuestions")}</p>
      </>,
    ],
    logo: {
      logoSrc: "/images/default-housing-logo.svg",
      logoAltText: "Jurisdiction Logo",
      logoUrl: "/",
    },
    socialLinks: [
      // Examples of social links
      // {
      //   icon: SocialLinkType.LinkedIn,
      //   href: "https://www.exygy.com",
      // },
      // {
      //   icon: SocialLinkType.Facebook,
      //   href: "https://www.exygy.com",
      // },
      // {
      //   icon: SocialLinkType.X,
      //   href: "https://www.exygy.com",
      // },
      // {
      //   icon: SocialLinkType.Instagram,
      //   href: "https://www.exygy.com",
      // },
      // {
      //   icon: SocialLinkType.YouTube,
      //   href: "https://www.exygy.com",
      // },
    ],
  }
}

export const getGenericFooterLinksContent = (): FooterLinks => {
  return {
    links: [
      { text: t("footer.giveFeedback"), href: "/" },
      { text: t("footer.contact"), href: "/" },
      { text: t("pageTitle.privacy"), href: "/privacy" },
      { text: t("pageTitle.disclaimer"), href: "/disclaimer" },
    ],
    cityString: t("footer.copyright"),
  }
}
