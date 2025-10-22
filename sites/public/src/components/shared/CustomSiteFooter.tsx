import React from "react"
import { t } from "@bloom-housing/ui-components"
import MaxWidthLayout from "../../layouts/max-width"
import styles from "./CustomSiteFooter.module.scss"
import dayjs from "dayjs"

const CustomSiteFooter = () => {
  return (
    <footer>
      <MaxWidthLayout className={styles["footer-container"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer"]}>
            <div className={styles["left-column-container"]}>
              <div className={styles["icon-container"]}>
                <a
                  href={
                    "https://mtc.ca.gov/about-mtc/authorities/bay-area-housing-finance-authority-bahfa"
                  }
                  className={styles["jurisdiction-icon"]}
                >
                  <img src="/images/bahfa-logo.png" alt={t("footer.bahfaLogo")} />
                </a>
              </div>
              <div className={styles["jurisdiction-address"]}>
                375 Beale Street, Suite 800
                <br /> San Francisco, CA 94105-2066
                <br /> {t("footer.mondayToFriday")}
                <br />
                <a href="mailto: doorway@bayareametro.gov" className="underline">
                  doorway@bayareametro.gov
                </a>
                <p className="w-64">{t("footer.phoneNumber")}</p>
              </div>
            </div>
            <div className={styles["right-column-container"]}>
              <div className={styles.links}>
                <a href="https://mtc.ca.gov/doorway-housing-portal-privacy-policy" target="_blank">
                  {t("pageTitle.privacy")}
                </a>
                <a href="https://mtc.ca.gov/doorway-housing-portal-terms-use" target="_blank">
                  {t("pageTitle.termsOfUse")}
                </a>
                <a href="https://mtc.ca.gov/bahfa-non-discrimination-statement" target="_blank">
                  {t("pageTitle.bahfaNonDiscriminationStatement")}
                </a>
                <a
                  href="https://mtc.ca.gov/about-mtc/public-participation/language-assistance"
                  target="_blank"
                >
                  {t("pageTitle.languageAssistance")}
                </a>
                <a
                  href="https://mtc.ca.gov/doorway-housing-portal-accessibility-statement"
                  target="_blank"
                >
                  {t("footer.accessibilityStatement")}
                </a>
              </div>
              <div className={styles["icon-container"]}>
                <a
                  href="https://twitter.com/mtcbata"
                  target="_blank"
                  className={styles["social-icon"]}
                >
                  <img src="/images/twitter-logo.svg" alt={t("footer.twitterLogo")} />
                </a>
                <a
                  href="https://www.linkedin.com/company/metropolitan-transportation-commission"
                  target="_blank"
                  className={styles["social-icon"]}
                >
                  <img src="/images/linkedin-logo.svg" alt={t("footer.linkedinLogo")} />
                </a>
                <a
                  href="https://www.facebook.com/MTCBATA"
                  target="_blank"
                  className={styles["social-icon"]}
                >
                  <img src="/images/facebook-logo.svg" alt={t("footer.facebookLogo")} />
                </a>
                <a
                  href="https://www.youtube.com/user/mtcabaglibrary"
                  target="_blank"
                  className={styles["social-icon"]}
                >
                  <img src="/images/youtube-logo.svg" alt={t("footer.youtubeLogo")} />
                </a>
                <a
                  href="https://www.instagram.com/mtcbata/"
                  target="_blank"
                  className={styles["social-icon"]}
                >
                  <img src="/images/instagram-logo.svg" alt={t("footer.instagramLogo")} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthLayout>
      <MaxWidthLayout
        className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
      >
        <div className={`${styles["footer"]} ${styles["copyright"]}`}>
          <div>{t("footer.bahfaCopyright", { year: dayjs().year() })}</div>
          <div>
            <img src="/images/eho-logo.svg" alt={t("footer.ehoLogo")} />
          </div>
        </div>
      </MaxWidthLayout>
    </footer>
  )
}

export default CustomSiteFooter
