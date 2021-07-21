import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable, Button, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { UnitDrawer } from "../DetailsUnitDrawer"

type DetailUnitsProps = {
  setUnitDrawer: (unit: UnitDrawer) => void
}

const DetailUnits = ({ setUnitDrawer }: DetailUnitsProps) => {
  const listing = useContext(ListingContext)

  const unitTableHeaders = {
    number: "listings.unit.number",
    unitType: "listings.unit.type",
    amiPercentage: "listings.unit.ami",
    monthlyRent: "listings.unit.rent",
    sqFeet: "listings.unit.sqft",
    priorityType: "listings.unit.priorityType",
    status: "listings.unit.status",
    action: "",
  }

  const unitTableData = useMemo(
    () =>
      listing?.units.map((unit) => ({
        number: unit.number,
        unitType: t(`listings.unitTypes.${unit.unitType}`),
        amiPercentage: unit.amiPercentage,
        monthlyRent: unit.monthlyRent,
        sqFeet: unit.sqFeet,
        priorityType: unit.priorityType,
        status: unit.status,
        action: (
          <Button
            type="button"
            className="font-semibold uppercase"
            onClick={() => setUnitDrawer(unit)}
            unstyled
          >
            {t("t.view")}
          </Button>
        ),
      })),
    [listing, setUnitDrawer]
  )

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.units")}
      grid={false}
      tinted
      inset
    >
      <GridSection title={t("listings.unit.details")} tinted={true} inset={true} grid={false}>
        <GridSection grid columns={1}>
          <ViewItem
            label={t("listings.unitTypesOrIndividual")}
            children={
              listing.disableUnitsAccordion
                ? t("listings.unit.unitTypes")
                : t("listings.unit.individualUnits")
            }
          />
        </GridSection>
      </GridSection>

      {listing.units.length ? (
        <MinimalTable headers={unitTableHeaders} data={unitTableData} />
      ) : (
        <span className="text-base font-semibold">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export { DetailUnits as default, DetailUnits }
