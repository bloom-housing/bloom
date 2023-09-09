import React from "react"
import { AppearanceStyleType, t, Button, Drawer } from "@bloom-housing/ui-components"
import { Card, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { Unit } from "@bloom-housing/backend-core/types"
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
      open={!!unit}
      title={t("listings.unit.title")}
      ariaDescription={t("listings.unit.title")}
      onClose={() => setUnitDrawer(null)}
    >
      <Card spacing="lg" className="spacer-section">
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
                children={unit?.unitType?.name || t("t.n/a")}
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

            {unit?.amiChartOverride?.items.map((override, index) => {
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
                id="unit.accessibilityPriorityType"
                label={t("listings.unit.accessibilityPriorityType")}
                children={unit?.priorityType?.name || t("t.n/a")}
              />
            </Grid.Row>
          </SectionWithGrid>
        </Card.Section>
      </Card>

      <Button styleType={AppearanceStyleType.primary} onClick={() => setUnitDrawer(null)}>
        {t("t.done")}
      </Button>
    </Drawer>
  )
}

export default DetailUnitDrawer
