import React from "react"
import { t } from "@bloom-housing/ui-components"
import { LanguagesEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../../../components/shared/CustomSiteFooter.module.scss"
import MaxWidthLayout from "../../../layouts/max-width"

export interface FooterProps {
  locale?: string
}

const feedbackLink = (locale: string) => {
  switch (locale) {
    case LanguagesEnum.es:
      return "https://docs.google.com/forms/d/e/1FAIpQLScmOWY8qR92vfJbPq6uCgIVW25N_D_u4RF-hwZ17NvprNgqkw/viewform"
    case LanguagesEnum.vi:
      return "https://docs.google.com/forms/d/e/1FAIpQLScCANRADZxFT7l0BiHVNifLXWeSstNmaNXqlfpy53jtxF8gxg/viewform"
    case LanguagesEnum.zh:
      return "https://docs.google.com/forms/d/e/1FAIpQLSedEJqjP3MtArBrhDwUTAY8jSCTLsIsKVV_i3tMk9EK59XOew/viewform"
    default:
      return "https://docs.google.com/forms/d/e/1FAIpQLScAZrM-4biqpQPFSJfaYef0dIiONYJ95n8pK1c8a5a8I78xxw/viewform"
  }
}

export const JurisdictionFooterSection = () => {
  const router = useRouter()
  return (
    <footer className={styles["footer-container"]}>
      <MaxWidthLayout className={styles["footer-container"]}>
        <div className={styles["footer-content-container"]}>
          <div className={styles["footer"]}>
            <div className={styles["icon-container"]}>
              <a
                href={"/"}
                className={styles["jurisdiction-icon"]}
                style={{ width: "var(--seeds-s32)", height: "var(--seeds-s30)" }}
              >
                <img src="/images/san-jose-logo-white.png" alt={"San José"} />
              </a>
            </div>
            <div className={styles["text-container"]}>
              <span>{t("footer.header")}</span>
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
                <Link href={"https://housing.acgov.org/"}>{t("footer.ACPortal")}</Link>
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
            <Link href={feedbackLink(router.locale)}>{t("footer.giveFeedback")}</Link>
            <Link href="mailto:SJHousingPortal@sanjoseca.gov">{t("footer.contact")}</Link>
            <Link href="/disclaimer">{t("pageTitle.disclaimer")}</Link>
            <Link href="/privacy">{t("pageTitle.privacy")}</Link>
          </div>
        </div>
      </MaxWidthLayout>
    </footer>
  )
}
