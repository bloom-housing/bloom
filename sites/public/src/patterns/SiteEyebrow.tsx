import React from "react"
import { tIfExists } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { Link } from "@bloom-housing/ui-seeds"
import styles from "./SiteHeader.module.scss"
import MaxWidthLayout from "../layouts/max-width"
import { getJurisdictionEyebrowImageContent } from "../static_content/jurisdiction_eyebrow_image"

export const SiteEyebrow = () => {
  const imageContent = getJurisdictionEyebrowImageContent()

  if (tIfExists("nav.eyebrow.text") || imageContent.logoSrc) {
    return (
      <div className={styles["eyebrow-wrapper"]}>
        <MaxWidthLayout>
          <div className={styles["eyebrow-container"]}>
            {imageContent.logoSrc && (
              <a href={imageContent.logoUrl || "/"} className={styles["logo"]}>
                <img
                  src={imageContent.logoSrc}
                  alt={imageContent.logoAltText || "Jurisdiction Logo"}
                />
              </a>
            )}

            {tIfExists("nav.eyebrow.text") && (
              <div className={styles["content-container"]}>
                {t("nav.eyebrow.text")}
                {tIfExists("nav.eyebrow.link") && (
                  <Link className={styles["eyebrow-link"]} href={t("nav.eyebrow.url")}>
                    {t("nav.eyebrow.link")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </MaxWidthLayout>
      </div>
    )
  } else return null
}
