import React, { useContext, useMemo } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { DataTable } from "../../../shared/DataTable"
import { getUnitColumns, unitGroupToRow, unitToRow } from "../../UnitTableColDefs"
import unitTableStyles from "../../UnitTableColDefs.module.scss"
import { UnitDrawer } from "../DetailsUnitDrawer"

type DetailUnitsProps = {
  setUnitDrawer: (unit: UnitDrawer) => void
}

const DetailUnits = ({ setUnitDrawer }: DetailUnitsProps) => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableHomeType = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHomeType,
    listing.jurisdictions.id
  )

  const enableSection8Question = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableSection8Question,
    listing.jurisdictions.id
  )

  const enableUnitGroups = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUnitGroups,
    listing.jurisdictions.id
  )

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    listing.jurisdictions.id
  )

  const showNonRegulated =
    enableNonRegulatedListings && listing.listingType === EnumListingListingType.nonRegulated

  const unitColumns = useMemo(
    () =>
      getUnitColumns({
        enableUnitGroups,
        showNonRegulated,
        disableSorting: true,
        actionsCell: enableUnitGroups
          ? undefined
          : (row) => (
              <Button
                type="button"
                variant="text"
                size="sm"
                className={"font-semibold darker-link"}
                onClick={() => setUnitDrawer(listing.units.find((unit) => unit.id === row.id))}
              >
                {t("t.view")}
              </Button>
            ),
      }),
    [enableUnitGroups, showNonRegulated, listing.units, setUnitDrawer]
  )

  const unitRows = useMemo(() => {
    if (enableUnitGroups) {
      return listing.unitGroups.map((unitGroup) => unitGroupToRow(unitGroup, showNonRegulated))
    }
    return listing.units.map(unitToRow)
  }, [listing.units, listing.unitGroups, enableUnitGroups, showNonRegulated])

  const listingAvailabilityText = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ReviewOrderTypeEnum.waitlist:
      case ReviewOrderTypeEnum.waitlistLottery:
        return t("listings.waitlist.open")
      case ReviewOrderTypeEnum.lottery:
      case ReviewOrderTypeEnum.firstComeFirstServe:
        return t("listings.availableUnits")
      default:
        return t("t.none")
    }
  }, [listing?.reviewOrderType])

  return (
    <SectionWithGrid heading={t("listings.units")} inset>
      {enableHomeType && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="homeType" label={t("listings.homeType")}>
              {listing.homeType ? t(`listings.homeType.${listing.homeType}`) : t("t.none")}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
      {!enableUnitGroups && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue
              id="unitTypesOrIndividual"
              label={t("listings.unitTypesOrIndividual")}
              children={
                listing.disableUnitsAccordion
                  ? t("listings.unit.unitTypes")
                  : t("listings.unit.individualUnits")
              }
            />
          </Grid.Cell>
          <Grid.Cell>
            <FieldValue
              id="listings.listingAvailabilityQuestion"
              label={t("listings.listingAvailabilityQuestion")}
              children={listingAvailabilityText}
            />
          </Grid.Cell>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Cell>
          {(enableUnitGroups ? !!listing.unitGroups : !!listing.units.length) ? (
            <DataTable
              description={t("listings.units")}
              columns={unitColumns}
              data={unitRows}
              disablePagination
              tableClassName={unitTableStyles["unit-table"]}
            />
          ) : (
            <>
              <hr className="spacer-header" />
              <span className="text-base font-semibold pt-4">{t("t.none")}</span>
            </>
          )}
        </Grid.Cell>
      </Grid.Row>
      {enableSection8Question && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue
              id="listings.section8Title"
              testId="listing-section-8-acceptance"
              label={t("listings.section8Title")}
            >
              {listing.section8Acceptance ? t("t.yes") : t("t.no")}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export { DetailUnits as default, DetailUnits }
