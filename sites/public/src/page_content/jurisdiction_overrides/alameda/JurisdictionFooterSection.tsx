import React from "react"
import { t } from "@bloom-housing/ui-components"
import Link from "next/link"
import styles from "../../../components/shared/CustomSiteFooter.module.scss"
import MaxWidthLayout from "../../../layouts/max-width"

export const JurisdictionFooterSection = () => {
  return (
    <footer>
      <MaxWidthLayout className={styles["footer-container"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer"]}>
            <div className={styles["icon-container"]}>
              <a href={"/"} className={`${styles["jurisdiction-icon"]}`}>
                <img src="/images/alameda-logo-white.svg" alt={"Alameda County"} />
              </a>
            </div>
            <div className={styles["text-container"]}>
              <span>{t("footer.header")}</span>
              <Link href={t("footer.headerUrl")}>{t("footer.headerLink")}</Link>
            </div>
            <div className={styles["text-container"]}>{t("footer.forListingQuestions")}</div>
            <div className={styles["text-container"]}>{t("footer.forGeneralInquiries")}</div>
            <div className={styles["text-container"]}>
              <div>{t("footer.forAdditionalOpportunities")}</div>
              <div>
                {process.env.doorwayUrl && (
                  <>
                    <Link href={process.env.doorwayUrl}>{t("footer.DoorwayHousingPortal")}</Link> |
                    {"  "}
                  </>
                )}
                <Link href={t("footer.SFHousingUrl")}>{t("footer.SFHousingPortal")}</Link> |{"  "}
                <Link href={t("footer.SJHousingUrl")}>{t("footer.SJHousingPortal")}</Link>
              </div>
            </div>
            <div className={styles["text-container"]}>
              <img src="/images/eho-logo-white.svg" alt="Equal Housing Opportunity Logo" />
            </div>
          </div>
        </div>
      </MaxWidthLayout>

      <MaxWidthLayout
        className={`${styles["footer-content-container"]} ${styles["copyright-content-container"]}`}
      >
        <div className={`${styles["footer"]} ${styles["copyright"]}`}>
          <div className={styles["copyright-text"]}>{t("footer.copyright")}</div>
          <div className={styles["links"]}>
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link">
              {t("footer.giveFeedback")}
            </Link>
            <Link href="mailto:achousingportal@edenir.org">{t("footer.contact")}</Link>
            <Link href="https://www.acgov.org/government/legal.htm">
              {t("pageTitle.disclaimer")}
            </Link>
            <Link href="/privacy">{t("pageTitle.privacy")}</Link>
          </div>
        </div>
      </MaxWidthLayout>
    </footer>
  )
}
