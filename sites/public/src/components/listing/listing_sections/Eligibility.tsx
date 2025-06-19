import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { CollapsibleSection } from "../../../patterns/CollapsibleSection"
import { OrderedSection } from "../../../patterns/OrderedSection"
import { EligibilitySection } from "../ListingViewSeedsHelpers"
import styles from "./Eligibility.module.scss"
import Markdown from "markdown-to-jsx"

type EligibilityProps = {
  eligibilitySections: EligibilitySection[]
  section8Acceptance?: boolean
}

export const Eligibility = ({ eligibilitySections, section8Acceptance }: EligibilityProps) => {
  if (!eligibilitySections.length) return
  return (
    <CollapsibleSection
      title={t("listings.sections.eligibilityTitle")}
      subtitle={
        <div>
          {t("listings.sections.eligibilitySubtitle")}
          {section8Acceptance && (
            <div className={"seeds-m-bs-content"}>
              <Markdown>{t("listings.section8VoucherInfo")}</Markdown>
            </div>
          )}
        </div>
      }
      priority={2}
      contentClassName={styles["mobile-collapse-padding"]}
    >
      <ol>
        {eligibilitySections
          .filter((section) => !section.hide)
          .map((section, index) => {
            return (
              <OrderedSection
                order={index + 1}
                title={section.header}
                subtitle={section.subheader}
                note={section.note}
                key={index}
                divider={index < eligibilitySections.length - 1}
              >
                {section.content}
              </OrderedSection>
            )
          })}
      </ol>
    </CollapsibleSection>
  )
}
