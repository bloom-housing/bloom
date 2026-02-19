import React from "react"
import MaxWidthLayout from "../../layouts/max-width"
import {
  getGenericFooterLinksContent,
  getGenericFooterTextContent,
} from "../../static_content/generic_footer_content"
import styles from "./CustomSiteFooter.module.scss"
import {
  getJurisdictionFooterLinksContent,
  getJurisdictionFooterTextContent,
} from "../../static_content/jurisdiction_footer_content"

const CustomSiteFooter = () => {
  const textContent: React.ReactNode | null =
    getJurisdictionFooterTextContent() || getGenericFooterTextContent()
  const footerLinksContent: React.ReactNode | null =
    getJurisdictionFooterLinksContent() || getGenericFooterLinksContent()

  return (
    <footer>
      <MaxWidthLayout className={styles["footer-container"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer"]}>{textContent}</div>
        </div>
      </MaxWidthLayout>
      <MaxWidthLayout
        className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
      >
        <div className={`${styles["footer"]} ${styles["copyright"]}`}>{footerLinksContent}</div>
      </MaxWidthLayout>
    </footer>
  )
}

export default CustomSiteFooter
