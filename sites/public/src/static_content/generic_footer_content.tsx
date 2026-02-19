import { Link } from "@bloom-housing/ui-seeds"
import styles from "../components/shared/CustomSiteFooter.module.scss"
import { t } from "@bloom-housing/ui-components"

export type FooterLinks = {
  links: {
    text: string
    href: string
  }[]
  cityString: string
}

export const getGenericFooterTextContent = (): React.ReactNode => {
  return (
    <>
      <div className={styles["icon-container"]}>
        <a href={"/"} className={styles["jurisdiction-icon"]}>
          <img src="/images/default-housing-logo.svg" alt={"Jurisdiction Logo"} />
        </a>
      </div>
      <div className={styles["text-container"]}>
        <span>{t("footer.content.projectOf")}</span>{" "}
        <Link href={"/"}>Mayor's Office of Housing Development</Link>{" "}
      </div>
      <div className={styles["text-container"]}></div>
      <div className={styles["text-container"]}>
        <p>{t("footer.content.applicationQuestions")}</p>
        <p>{t("footer.content.programQuestions")}</p>
      </div>
    </>
  )
}

export const getGenericFooterLinksContent = (): React.ReactNode => {
  const linkContent: FooterLinks = {
    links: [
      { text: t("footer.giveFeedback"), href: "/" },
      { text: t("footer.contact"), href: "/" },
      { text: t("pageTitle.privacy"), href: "/privacy" },
      { text: t("pageTitle.disclaimer"), href: "/disclaimer" },
    ],
    cityString: t("footer.copyright"),
  }
  return (
    <>
      <div className={styles["copyright-text"]}>{linkContent.cityString || ""}</div>
      <div className={styles.links}>
        {linkContent.links?.map((link, index) => (
          <Link key={index} href={link.href}>
            {link.text}
          </Link>
        ))}
      </div>
    </>
  )
}
