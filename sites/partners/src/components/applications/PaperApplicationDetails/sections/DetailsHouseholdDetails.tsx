import React, { useContext, Fragment } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
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
        <FieldValue label={t("application.details.preferredUnitSizes")} testId="preferredUnitSizes">
          {(() => {
            if (!preferredUnits.length) return t("t.n/a")

            return preferredUnits?.map((item) => (
              <Fragment key={item.id}>
                {t(`application.household.preferredUnit.options.${item.name}`)}
                <br />
              </Fragment>
            ))
          })()}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue label={t("application.details.adaPriorities")} testId="adaPriorities">
          {accessibilityLabels(application.accessibility).map((item) => (
            <Fragment key={item}>
              {item}
              <br />
            </Fragment>
          ))}
        </FieldValue>
      </GridCell>
      <GridCell>
        <FieldValue
          id="householdChanges"
          label={t("application.household.expectingChanges.title")}
          testId="expectingChanges"
        >
          {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
        </FieldValue>
      </GridCell>

      <GridCell>
        <FieldValue
          id="householdStudent"
          label={t("application.household.householdStudent.title")}
          testId="householdStudent"
        >
          {application.householdStudent ? t("t.yes") : t("t.no")}
        </FieldValue>
      </GridCell>
    </GridSection>
  )
}

export { DetailsHouseholdDetails as default, DetailsHouseholdDetails }
