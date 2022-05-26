import React, { useContext, useMemo } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  ViewItem,
  GridCell,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { UnitDrawer } from "../DetailsUnitDrawer"
import { ListingAvailability } from "@bloom-housing/backend-core"

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
    action: "",
  }

  const unitTableData = useMemo(
    () =>
      listing?.units.map((unit) => ({
        number: { content: unit.number },
        unitType: { content: unit.unitType && t(`listings.unitTypes.${unit.unitType.name}`) },
        amiPercentage: { content: unit.amiPercentage },
        monthlyRent: { content: unit.monthlyRent },
        sqFeet: { content: unit.sqFeet },
        priorityType: { content: unit.priorityType?.name },
        action: {
          content: (
            <Button
              type="button"
              className="font-semibold uppercase"
              onClick={() => setUnitDrawer(unit)}
              unstyled
            >
              {t("t.view")}
            </Button>
          ),
        },
      })),
    [listing, setUnitDrawer]
  )

  const listingAvailabilityText = useMemo(() => {
    if (listing.listingAvailability === ListingAvailability.availableUnits) {
      return t("listings.availableUnits")
    } else if (listing.listingAvailability === ListingAvailability.openWaitlist) {
      return t("listings.waitlist.open")
    }
    return t("t.none")
  }, [listing])

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.units")}
      grid={true}
      tinted
      inset
      columns={2}
    >
      <GridCell span={1}>
        <ViewItem
          id="unitTypesOrIndividual"
          dataTestId={"unit-types-or-individual"}
          label={t("listings.unitTypesOrIndividual")}
          children={
            listing.disableUnitsAccordion
              ? t("listings.unit.unitTypes")
              : t("listings.unit.individualUnits")
          }
        />
      </GridCell>
      <GridCell span={1}>
        <ViewItem
          id="listings.listingAvailabilityQuestion"
          dataTestId={"listing-availability-question"}
          label={t("listings.listingAvailabilityQuestion")}
          children={listingAvailabilityText}
        />
      </GridCell>
      <GridCell span={2}>
        {listing.units.length ? (
          <MinimalTable id="unitTable" headers={unitTableHeaders} data={unitTableData} />
        ) : (
          <>
            <hr className={"mt-4 mb-4"} />
            <span className="text-base font-semibold pt-4">{t("t.none")}</span>
          </>
        )}
      </GridCell>
    </GridSection>
  )
}

export { DetailUnits as default, DetailUnits }
