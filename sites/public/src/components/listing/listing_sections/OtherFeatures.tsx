import { HeadingGroup } from "@bloom-housing/ui-seeds"
import styles from "../ListingViewSeeds.module.scss"
import { t } from "@bloom-housing/ui-components"

type OtherFeaturesProps = {
  hasEbllClearence: boolean
}

export const OtherFeatures = ({ hasEbllClearence }: OtherFeaturesProps) => {
  return (
    <div className="seeds-m-bs-header">
      <HeadingGroup
        heading={t("t.other")}
        headingProps={{ size: "lg", priority: 3 }}
        subheading={
          hasEbllClearence ? t("listings.hasEbllClearance") : t("listings.noEbllClearance")
        }
        className={`${styles["heading-group"]} seeds-m-be-section`}
      />
    </div>
  )
}
