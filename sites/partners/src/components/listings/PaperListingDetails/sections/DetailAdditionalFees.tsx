import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailAdditionalFees = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableUtilitiesIncluded = doJurisdictionsHaveFeatureFlagOn(
    "enableUtilitiesIncluded",
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
    return utilitiesExist ? utilities : <>{t("t.none")}</>
  }

  return (
    <SectionWithGrid heading={t("listings.sections.additionalFees")} inset>
      <Grid.Row>
        <FieldValue id="applicationFee" label={t("listings.applicationFee")}>
          {getDetailFieldString(listing.applicationFee)}
        </FieldValue>
        <FieldValue id="depositMin" label={t("listings.depositMin")}>
          {getDetailFieldString(listing.depositMin)}
        </FieldValue>
        <FieldValue id="depositMax" label={t("listings.depositMax")}>
          {getDetailFieldString(listing.depositMax)}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue label={t("listings.sections.depositHelperText")}>
          {getDetailFieldString(listing.depositHelperText)}
        </FieldValue>
        <FieldValue id="costsNotIncluded" label={t("listings.sections.costsNotIncluded")}>
          {getDetailFieldString(listing.costsNotIncluded)}
        </FieldValue>
      </Grid.Row>
      {enableUtilitiesIncluded && (
        <Grid.Row>
          <FieldValue id="utilities" label={t("listings.sections.utilities")}>
            <ul className={"flex flex-wrap"}>{getUtilitiesIncluded()}</ul>
          </FieldValue>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAdditionalFees
