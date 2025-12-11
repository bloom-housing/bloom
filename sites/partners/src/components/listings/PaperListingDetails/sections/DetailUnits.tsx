import React, { useContext, useMemo } from "react"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { Button, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  EnumListingListingType,
  EnumUnitGroupAmiLevelMonthlyRentDeterminationType,
  FeatureFlagEnum,
  MinMax,
  RentTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { ListingContext } from "../../ListingContext"
import { formatRange, formatRentRange, minMaxFinder } from "../../helpers"
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

  const unitTableHeaders = enableUnitGroups
    ? {
        unitType: "listings.unit.type",
        number: "listings.unit.totalCount",
        ...(!showNonRegulated ? { amiPercentage: "t.ami" } : {}),
        monthlyRent: "listings.unit.rent",
        occupancy: "listings.unit.occupancy",
        ...(!showNonRegulated ? { sqFeet: "listings.unit.sqft" } : {}),
        bath: "listings.unit.bath",
      }
    : {
        number: "listings.unit.number",
        unitType: "listings.unit.type",
        amiPercentage: "t.ami",
        monthlyRent: "listings.unit.rent",
        sqFeet: "listings.unit.sqft",
        unitAccessibilityPriorityTypes: "listings.unit.priorityType",
        action: "",
      }

  const unitTableData = useMemo(() => {
    if (enableUnitGroups) {
      if (showNonRegulated) {
        return listing.unitGroups.map((unitGroup) => {
          const rentValue =
            unitGroup.rentType === RentTypeEnum.fixedRent
              ? unitGroup.monthlyRent
              : formatRange(unitGroup.flatRentValueFrom, unitGroup.flatRentValueTo)

          return {
            unitType: {
              content:
                unitGroup?.unitTypes
                  .map((unitType) => t(`listings.unitTypes.${unitType.name}`))
                  .join(", ") || "",
            },
            number: { content: unitGroup.totalCount },
            monthlyRent: { content: rentValue },
            occupancy: { content: formatRange(unitGroup.minOccupancy, unitGroup.maxOccupancy) },
            bath: { content: formatRange(unitGroup.bathroomMin, unitGroup.bathroomMax) },
          }
        })
      } else {
        return listing.unitGroups.map((unitGroup) => {
          let amiRange: MinMax, rentRange: MinMax, percentIncomeRange: MinMax

          unitGroup.unitGroupAmiLevels.forEach((ami) => {
            if (ami.amiPercentage) {
              amiRange = minMaxFinder(amiRange, ami.amiPercentage)
            }
            if (
              ami.flatRentValue &&
              ami.monthlyRentDeterminationType ===
                EnumUnitGroupAmiLevelMonthlyRentDeterminationType.flatRent
            ) {
              rentRange = minMaxFinder(rentRange, ami.flatRentValue)
            }
            if (
              ami.percentageOfIncomeValue &&
              ami.monthlyRentDeterminationType ===
                EnumUnitGroupAmiLevelMonthlyRentDeterminationType.percentageOfIncome
            ) {
              percentIncomeRange = minMaxFinder(percentIncomeRange, ami.percentageOfIncomeValue)
            }
          })

          return {
            unitType: {
              content:
                unitGroup?.unitTypes
                  .map((unitType) => t(`listings.unitTypes.${unitType.name}`))
                  .join(", ") || "",
            },
            number: { content: unitGroup.totalCount },
            amiPercentage: {
              content: amiRange && formatRange(amiRange.min, amiRange.max, "", "%"),
            },
            monthlyRent: { content: formatRentRange(rentRange, percentIncomeRange) },
            occupancy: { content: formatRange(unitGroup.minOccupancy, unitGroup.maxOccupancy) },
            sqFeet: { content: formatRange(unitGroup.sqFeetMin, unitGroup.sqFeetMax) },
            bath: { content: formatRange(unitGroup.bathroomMin, unitGroup.bathroomMax) },
          }
        })
      }
    } else {
      return listing.units.map((unit) => ({
        number: { content: unit.number },
        unitType: { content: unit.unitTypes && t(`listings.unitTypes.${unit.unitTypes.name}`) },
        amiPercentage: { content: unit.amiPercentage },
        monthlyRent: { content: unit.monthlyRent },
        sqFeet: { content: unit.sqFeet },
        unitAccessibilityPriorityTypes: { content: unit.unitAccessibilityPriorityTypes?.name },
        action: {
          content: (
            <Button
              type="button"
              variant="text"
              size="sm"
              className={"font-semibold darker-link"}
              onClick={() => setUnitDrawer(unit)}
            >
              {t("t.view")}
            </Button>
          ),
        },
      }))
    }
  }, [listing.units, listing.unitGroups, enableUnitGroups, showNonRegulated, setUnitDrawer])

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
              testId={"unit-types-or-individual"}
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
              testId={"listing-availability-question"}
              label={t("listings.listingAvailabilityQuestion")}
              children={listingAvailabilityText}
            />
          </Grid.Cell>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Cell>
          {(enableUnitGroups ? !!listing.unitGroups : !!listing.units.length) ? (
            <MinimalTable id="unitTable" headers={unitTableHeaders} data={unitTableData} />
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
