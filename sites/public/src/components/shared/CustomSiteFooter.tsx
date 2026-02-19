import React from "react"
import MaxWidthLayout from "../../layouts/max-width"
import {
  FooterContent,
  FooterLinks,
  getGenericFooterLinksContent,
  getGenericFooterTextContent,
} from "../../static_content/generic_footer_content"
import styles from "./CustomSiteFooter.module.scss"
import {
  getJurisdictionFooterLinksContent,
  getJurisdictionFooterTextContent,
} from "../../static_content/jurisdiction_footer_content"
import { Link } from "@bloom-housing/ui-seeds"

const CustomSiteFooter = () => {
  const textContent: FooterContent | null =
    getJurisdictionFooterTextContent() || getGenericFooterTextContent()
  const footerLinksContent: FooterLinks | null =
    getJurisdictionFooterLinksContent() || getGenericFooterLinksContent()

  const showContentFooter = textContent.logo || textContent.textSections?.length > 0
  const showLinksFooter = footerLinksContent.links?.length > 0 || footerLinksContent.cityString

  if (!showContentFooter && !showLinksFooter) return <></>

  return (
    <footer>
      {showContentFooter && (
        <MaxWidthLayout className={styles["footer-container"]}>
          <div className={styles["footer-content-container"]}>
            <div className={styles["footer"]}>
              {textContent.logo && (
                <div className={styles["icon-container"]}>
                  <a href={textContent.logo.logoUrl || "/"} className={styles["jurisdiction-icon"]}>
                    <img
                      src={textContent.logo.logoSrc}
                      alt={textContent.logo.logoAltText || "Jurisdiction Logo"}
                    />
                  </a>
                </div>
              )}
              {textContent.textSections.map((section, index) => (
                <div key={index} className={styles["text-container"]}>
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </MaxWidthLayout>
      )}
      {showLinksFooter && (
        <MaxWidthLayout
          className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
        >
          <div className={`${styles["footer"]} ${styles["copyright"]}`}>
            <div className={styles["copyright-text"]}>{footerLinksContent.cityString || ""}</div>
            <div className={styles.links}>
              {footerLinksContent.links?.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </MaxWidthLayout>
      )}
    </footer>
  )
}

export default CustomSiteFooter
