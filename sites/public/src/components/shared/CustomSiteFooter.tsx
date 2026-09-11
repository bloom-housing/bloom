import React from "react"
import { Link } from "@bloom-housing/ui-seeds"
import MaxWidthLayout from "../../layouts/max-width"
import {
  FooterContent,
  FooterLinks,
  getGenericFooterLinksContent,
  getGenericFooterTextContent,
} from "../../static_content/generic_footer_content"
import {
  getJurisdictionFooterLinksContent,
  getJurisdictionFooterTextContent,
} from "../../static_content/jurisdiction_footer_content"
import {
  getStoredFooterLinksContent,
  getStoredFooterTextContent,
} from "../../static_content/stored_content"
import { useJurisdictionContent } from "../../lib/JurisdictionContentContext"
import styles from "./CustomSiteFooter.module.scss"
import { t } from "@bloom-housing/ui-components"

const CustomSiteFooter = () => {
  const jurisdictionContent = useJurisdictionContent()

  const textContent: FooterContent = {
    ...getGenericFooterTextContent(),
    ...getJurisdictionFooterTextContent(),
    ...getStoredFooterTextContent(jurisdictionContent),
  }
  const footerLinksContent: FooterLinks = {
    ...getGenericFooterLinksContent(),
    ...getJurisdictionFooterLinksContent(),
    ...getStoredFooterLinksContent(jurisdictionContent),
  }

  const showContentFooter =
    textContent.logo || textContent.textSections?.length > 0 || textContent.socialLinks?.length > 0
  const showLinksFooter =
    footerLinksContent.links?.length > 0 ||
    footerLinksContent.cityString ||
    footerLinksContent.equalHousingOpportunity

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
                  {section}
                </div>
              ))}
              {textContent.socialLinks?.length > 0 && (
                <div className={styles["icon-container"]}>
                  {textContent.socialLinks.map((social) => (
                    <a href={social.href} target="_blank" key={social.icon}>
                      <img
                        src={`/images/logo-${social.icon}.svg`}
                        alt={t(`footer.alt.${social.icon}`)}
                      />
                    </a>
                  ))}
                </div>
              )}
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
