import React, { useContext, Fragment } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { sortUnitTypes } from "@bloom-housing/shared-helpers"
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

  const preferredUnits = sortUnitTypes(application?.preferredUnit)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.review.householdDetails")}
      inset
    >
      <GridCell>
        <ViewItem
          label={t("application.details.preferredUnitSizes")}
          dataTestId="preferredUnitSizes"
        >
          {(() => {
            if (!preferredUnits.length) return t("t.n/a")

            return preferredUnits?.map((item) => (
              <Fragment key={item.id}>
                {t(`application.household.preferredUnit.options.${item.name}`)}
                <br />
              </Fragment>
            ))
          })()}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.details.adaPriorities")} dataTestId="adaPriorities">
          {accessibilityLabels(application.accessibility).map((item) => (
            <Fragment key={item}>
              {item}
              <br />
            </Fragment>
          ))}
        </ViewItem>
      </GridCell>
      <GridCell>
        <ViewItem
          id="householdChanges"
          label={t("application.household.expectingChanges.title")}
          dataTestId="expectingChanges"
        >
          {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem
          id="householdStudent"
          label={t("application.household.householdStudent.title")}
          dataTestId="householdStudent"
        >
          {application.householdStudent ? t("t.yes") : t("t.no")}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsHouseholdDetails as default, DetailsHouseholdDetails }
