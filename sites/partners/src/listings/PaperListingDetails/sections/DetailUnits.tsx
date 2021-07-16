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
        unitType: unit.unitType && t(`listings.unitTypes.${unit.unitType.name}`),
        amiPercentage: unit.amiPercentage,
        monthlyRent: unit.monthlyRent,
        sqFeet: unit.sqFeet,
        priorityType: unit.priorityType?.name,
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
      <ViewItem
        label={t("listings.unitTypesOrIndividual")}
        children={
          listing.disableUnitsAccordion
            ? t("listings.unit.unitTypes")
            : t("listings.unit.individualUnits")
        }
      />

      {listing.units.length ? (
        <MinimalTable headers={unitTableHeaders} data={unitTableData} />
      ) : (
        <>
          <hr className={"mt-4 mb-4"} />
          <span className="text-base font-semibold pt-4">{t("t.none")}</span>
        </>
      )}
    </GridSection>
  )
}

export { DetailUnits as default, DetailUnits }
