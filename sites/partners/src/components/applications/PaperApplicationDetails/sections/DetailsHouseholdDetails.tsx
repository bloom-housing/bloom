import React, { useContext, Fragment } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { sortUnitTypes } from "@bloom-housing/shared-helpers"
import { ApplicationContext } from "../../ApplicationContext"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type DetailsHouseholdDetailsProps = {
  enableAdaOtherOption: boolean
  enableFullTimeStudentQuestion?: boolean
}

const DetailsHouseholdDetails = ({
  enableAdaOtherOption,
  enableFullTimeStudentQuestion,
}: DetailsHouseholdDetailsProps) => {
  const application = useContext(ApplicationContext)

  const accessibilityLabels = (accessibility) => {
    const labels = []
    if (accessibility.mobility) labels.push(t("application.ada.mobility"))
    if (accessibility.vision) labels.push(t("application.ada.vision"))
    if (accessibility.hearing) labels.push(t("application.ada.hearing"))
    if (enableAdaOtherOption && accessibility.other) labels.push(t("application.ada.other"))
    if (labels.length === 0) labels.push(t("t.no"))

    return labels
  }

  const preferredUnits = sortUnitTypes(application?.preferredUnitTypes)

  return (
    <SectionWithGrid heading={t("application.review.householdDetails")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            label={t("application.details.preferredUnitSizes")}
            testId="preferredUnitSizes"
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
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue label={t("application.details.adaPriorities")} testId="adaPriorities">
            {application.accessibility &&
              accessibilityLabels(application.accessibility).map((item) => (
                <Fragment key={item}>
                  {item}
                  <br />
                </Fragment>
              ))}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue
            id="householdChanges"
            label={t("application.household.expectingChanges.title")}
            testId="expectingChanges"
          >
            {application.householdExpectingChanges ? t("t.yes") : t("t.no")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="householdStudent"
            label={
              enableFullTimeStudentQuestion
                ? t("application.household.householdStudentAll.title")
                : t("application.household.householdStudent.title")
            }
            testId="householdStudent"
          >
            {application.householdStudent ? t("t.yes") : t("t.no")}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsHouseholdDetails as default, DetailsHouseholdDetails }
