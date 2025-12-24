import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { HeadingGroup } from "@bloom-housing/ui-seeds"
import { CollapsibleSection } from "../../../patterns/CollapsibleSection"
import styles from "../ListingViewSeeds.module.scss"

type FeaturesProps = {
  children: React.ReactNode
  features: {
    heading: string
    subheading?: string
    content?: React.ReactNode
  }[]
}

export const Features = ({ children, features }: FeaturesProps) => {
  return (
    <CollapsibleSection
      title={t("listings.sections.featuresTitle")}
      subtitle={t("listings.sections.featuresSubtitle")}
      priority={2}
    >
      <div className={`${styles["mobile-inline-collapse-padding"]} seeds-m-bs-section`}>
        {features.map((feature, index) => {
          return (
            <>
              <HeadingGroup
                heading={feature.heading}
                subheading={feature.subheading}
                headingProps={{ size: "lg", priority: 3 }}
                className={`${styles["heading-group"]} ${
                  !feature.content ? "seeds-m-be-section" : "seeds-m-be-label"
                }`}
                key={index}
              />
              <div className={"seeds-m-be-section"}>{feature.content}</div>
            </>
          )
        })}
        {children}
      </div>
    </CollapsibleSection>
  )
}
