import React, { useContext, Fragment } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"

const DetailsHouseholdDetails = () => {
  const application = useContext(ApplicationContext)

  const accessibilityLabels = (accessibility) => {
    const labels = []
    if (accessibility.mobility) labels.push(t("application.ada.mobility"))
    if (accessibility.vision) labels.push(t("application.ada.vision"))
    if (accessibility.hearing) labels.push(t("application.ada.hearing"))
    if (labels.length === 0) labels.push(t("t.no"))

    return labels
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.review.householdDetails")}
      inset
      columns={3}
    >
      <GridCell>
        <ViewItem label={t("application.details.preferredUnitSizes")}>
          {(() => {
            if (!application?.preferredUnit?.length) return t("t.n/a")

            return application?.preferredUnit?.map((item) => (
              <Fragment key={item.id}>
                {t(`application.household.preferredUnit.options.${item.name}`)}
                <br />
              </Fragment>
            ))
          })()}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.adaPriorities")}>
          {accessibilityLabels(application.accessibility).map((item) => (
            <Fragment key={item}>
              {item}
              <br />
            </Fragment>
          ))}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsHouseholdDetails as default, DetailsHouseholdDetails }
