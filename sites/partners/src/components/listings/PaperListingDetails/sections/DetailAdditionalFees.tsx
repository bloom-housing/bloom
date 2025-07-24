import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailAdditionalFees = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableUtilitiesIncluded = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUtilitiesIncluded,
    listing.jurisdictions.id
  )

  const getUtilitiesIncluded = () => {
    let utilitiesExist = false
    const utilities = Object.keys(listing?.listingUtilities ?? {}).map((utility) => {
      if (listing?.listingUtilities[utility]) {
        utilitiesExist = true
        return (
          <li key={utility} className={"list-disc mx-5 mb-1 md:w-1/3 w-full grow"}>
            {t(`listings.utilities.${utility}`)}
          </li>
        )
      }
    })
    return utilitiesExist ? <ul className={"flex flex-wrap"}>{utilities}</ul> : <>{t("t.none")}</>
  }

  return (
    <SectionWithGrid heading={t("listings.sections.additionalFees")} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="applicationFee" label={t("listings.applicationFee")}>
            {getDetailFieldString(listing.applicationFee)}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue id="depositMin" label={t("listings.depositMin")}>
            {getDetailFieldString(listing.depositMin)}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue id="depositMax" label={t("listings.depositMax")}>
            {getDetailFieldString(listing.depositMax)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue label={t("listings.sections.depositHelperText")}>
            {getDetailFieldString(listing.depositHelperText)}
          </FieldValue>
        </Grid.Cell>
        <Grid.Cell>
          <FieldValue id="costsNotIncluded" label={t("listings.sections.costsNotIncluded")}>
            {getDetailFieldString(listing.costsNotIncluded)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      {enableUtilitiesIncluded && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="utilities" label={t("listings.sections.utilities")}>
              {getUtilitiesIncluded()}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAdditionalFees
