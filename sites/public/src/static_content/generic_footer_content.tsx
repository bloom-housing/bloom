import { Link } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"

export type FooterContent = {
  textSections: React.ReactNode[]
  logo?: {
    logoSrc: string
    logoAltText?: string
    logoUrl?: string
  }
}

export type FooterLinks = {
  links: {
    text: string
    href: string
  }[]
  cityString?: string
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
