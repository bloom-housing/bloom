import React from "react"
import Link from "next/link"
import { t } from "@bloom-housing/ui-components"
import styles from "./CustomSiteFooter.module.scss"
import Markdown from "markdown-to-jsx"

const CustomSiteFooter = () => {
  return (
    <footer className={styles["footer-container"]}>
      <div className={styles["footer-content-container"]}>
        <div className={styles["footer"]}>
          <div className={styles["icon-container"]}>
            <img
              className={styles["jurisdiction-icon"]}
              src="/images/detroit-logo-white.png"
              alt={t("footer.logoAlt")}
            />
          </div>
          <div className={styles["text-container"]}>
            <p>{t("footer.description")}</p>
          </div>

          <div className={styles["text-container"]}>
            <p>{t("footer.forListingQuestions")}</p>
            <p>{t("footer.pleaseContact")}</p>
          </div>
          <div className={styles["text-container"]}>
            <p>{t("footer.forGeneralInquiries")}</p>
            <p>
              <Markdown>{t("footer.contactInfo")}</Markdown>
            </p>
          </div>
        </div>
      </div>
      <div
        className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
      >
        <div className={`${styles["footer"]} ${styles["copyright"]}`}>
          <div className={styles["copyright-text"]}>{t("footer.copyright")}</div>
          <div className={styles.links}>
            <Link href="/feedback">{t("footer.giveFeedback")}</Link>
            <Link href="/privacy">{t("pageTitle.privacy")}</Link>
            <Link href="/disclaimer">{t("pageTitle.disclaimer")}</Link>
            <Link href="/accessibility">{t("pageTitle.accessibilityStatement")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CustomSiteFooter
