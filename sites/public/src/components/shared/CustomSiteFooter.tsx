import React from "react"
import Link from "next/link"
import { t } from "@bloom-housing/ui-components"
import MaxWidthLayout from "../../layouts/max-width"
import styles from "./CustomSiteFooter.module.scss"

const CustomSiteFooter = () => {
  return (
    <footer>
      <MaxWidthLayout className={styles["footer-container"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer"]}>
            <div className={styles["icon-container"]}>
              <a href={"/"} className={styles["jurisdiction-icon"]}>
                <img src="/images/la-logo-grayscale.svg" alt={"Jurisdiction Logo"} />
              </a>
            </div>
            <div className={styles["text-container"]}>
              <span>{t("footer.content.projectOf")}</span>
              <Link href={"/"}>Mayor's Office of Housing Development</Link>
            </div>
            <div className={styles["text-container"]}>
              <span>{t("footer.content.partnership")}</span>
              <Link href={"/"}>Bloomington Department of Technology</Link>
              <Link href={"/"}>Mayor's Office of Civic Innovation</Link>
            </div>
            <div className={styles["text-container"]}>
              <p>{t("footer.content.applicationQuestions")}</p>
              <p>{t("footer.content.programQuestions")}</p>
            </div>
          </div>
        </div>
      </MaxWidthLayout>
      <MaxWidthLayout
        className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
      >
        <div className={`${styles["footer"]} ${styles["copyright"]}`}>
          <div className={styles["copyright-text"]}>{t("footer.copyright")}</div>
          <div className={styles.links}>
            <Link href="/">{t("footer.giveFeedback")}</Link>
            <Link href="/">{t("footer.contact")}</Link>
            <Link href="/privacy">{t("pageTitle.privacy")}</Link>
            <Link href="/disclaimer">{t("pageTitle.disclaimer")}</Link>
          </div>
        </div>
      </MaxWidthLayout>
    </footer>
  )
}

export default CustomSiteFooter
