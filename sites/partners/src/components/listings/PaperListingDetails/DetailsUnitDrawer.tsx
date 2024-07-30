import React from "react"
import { Unit } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { getRentType } from "../../../lib/helpers"
import { useSingleAmiChartData } from "../../../lib/hooks"
import SectionWithGrid from "../../shared/SectionWithGrid"

export type UnitDrawer = Unit | null

type UnitDrawerProps = {
  unit: UnitDrawer
  setUnitDrawer: (unit: UnitDrawer) => void
}

const AmiChartWrapper = (amiChartId) => {
  const { data } = useSingleAmiChartData(amiChartId)

  return data ? data.name : t("t.n/a")
}

const DetailUnitDrawer = ({ unit, setUnitDrawer }: UnitDrawerProps) => {
  const rentType = getRentType(unit)

  return (
    <Drawer
      isOpen={!!unit}
      onClose={() => setUnitDrawer(null)}
      ariaLabelledBy="details-unit-drawer-header"
    >
      <Drawer.Header id="details-unit-drawer-header">{t("listings.unit.title")}</Drawer.Header>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.details")} inset>
              <Grid.Row columns={4}>
                <FieldValue
                  id="unit.unitNumber"
                  label={t("listings.unit.unitNumber")}
                  children={unit?.number || t("t.n/a")}
                />

                <FieldValue
                  label={t("listings.unit.type")}
                  children={
                    unit?.unitTypes?.name
                      ? t(`listings.unit.typeOptions.${unit?.unitTypes?.name}`)
                      : t("t.n/a")
                  }
                />

                <FieldValue
                  id="unit.numBathrooms"
                  label={t("listings.unit.numBathrooms")}
                  children={unit?.numBathrooms || t("t.n/a")}
                />

                <FieldValue
                  id="unit.floor"
                  label={t("listings.unit.floor")}
                  children={unit?.floor || t("t.n/a")}
                />

                <FieldValue
                  id="unit.squareFootage"
                  label={t("listings.unit.squareFootage")}
                  children={unit?.sqFeet || t("t.n/a")}
                />

                <FieldValue
                  id="unit.minOccupancy"
                  label={t("listings.unit.minOccupancy")}
                  children={unit?.minOccupancy || t("t.n/a")}
                />

                <FieldValue
                  id="unit.maxOccupancy"
                  label={t("listings.unit.maxOccupancy")}
                  children={unit?.maxOccupancy || t("t.n/a")}
                />
              </Grid.Row>
            </SectionWithGrid>
            <SectionWithGrid heading={t("listings.unit.eligibility")} inset>
              <Grid.Row columns={4}>
                <FieldValue
                  id="unit.amiChart"
                  label={t("listings.unit.amiChart")}
                  children={unit?.amiChart?.id ? AmiChartWrapper(unit.amiChart.id) : t("t.n/a")}
                />
                <FieldValue
                  id="unit.amiPercentage"
                  label={t("listings.unit.amiPercentage")}
                  children={unit?.amiPercentage || t("t.n/a")}
                />
              </Grid.Row>

              {unit?.unitAmiChartOverrides?.items.map((override, index) => {
                return (
                  <Grid.Row>
                    <FieldValue
                      id="amiOverrideTitle"
                      key={index}
                      label={t("listings.amiOverrideTitle", {
                        householdSize: override.householdSize,
                      })}
                      children={`$${override.income}`}
                    />
                  </Grid.Row>
                )
              })}
              <Grid.Row columns={4}>
                {rentType === "fixed" && (
                  <>
                    <FieldValue
                      id="unit.monthlyIncomeMin"
                      label={t("t.monthlyMinimumIncome")}
                      children={unit?.monthlyIncomeMin || t("t.n/a")}
                    />
                    <FieldValue
                      id="unit.monthlyRent"
                      label={t("listings.unit.monthlyRent")}
                      children={unit?.monthlyRent || t("t.n/a")}
                    />
                  </>
                )}
                {rentType === "percentage" && (
                  <FieldValue
                    id="unit.percentage"
                    label={t("listings.unit.percentage")}
                    children={unit?.monthlyRentAsPercentOfIncome || t("t.n/a")}
                  />
                )}
              </Grid.Row>
            </SectionWithGrid>
            <SectionWithGrid heading={t("t.accessibility")} inset>
              <Grid.Row columns={4}>
                <FieldValue
                  id="unit.unitAccessibilityPriorityTypes"
                  label={t("listings.unit.accessibilityPriorityType")}
                  children={unit?.unitAccessibilityPriorityTypes?.name || t("t.n/a")}
                />
              </Grid.Row>
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button variant="primary" size="sm" onClick={() => setUnitDrawer(null)}>
          {t("t.done")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export default DetailUnitDrawer
