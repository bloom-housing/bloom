import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldNumber, getDetailFieldString } from "./helpers"
import { AuthContext, listingUtilities } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  EnumListingDepositType,
  EnumListingListingType,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailAdditionalFees = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableUtilitiesIncluded = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUtilitiesIncluded,
    listing.jurisdictions.id
  )

  const enableCreditScreeningFee = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableCreditScreeningFee,
    listing.jurisdictions.id
  )

  const getUtilitiesIncluded = () => {
    let utilitiesExist = false
    const utilities = Object.keys(listing?.listingUtilities ?? {})
      .filter((feature) => listingUtilities.includes(feature))
      .map((utility) => {
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
        {listing.listingType === EnumListingListingType.regulated && (
          <>
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
          </>
        )}
      </Grid.Row>
      {listing.listingType === EnumListingListingType.nonRegulated && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="depositType" label={t("listings.depositTitle")}>
              {listing.depositType === EnumListingDepositType.fixedDeposit
                ? t("listings.depositFixed")
                : t("listings.depositRange")}
            </FieldValue>
          </Grid.Cell>
          {listing.depositType === EnumListingDepositType.fixedDeposit ? (
            <Grid.Cell>
              <FieldValue id="depositValue" label={t("listings.depositValue")}>
                {getDetailFieldNumber(listing.depositValue)}
              </FieldValue>
            </Grid.Cell>
          ) : (
            <>
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
            </>
          )}
        </Grid.Row>
      )}
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
      {enableCreditScreeningFee && (
        <Grid.Row>
          <Grid.Cell>
            <FieldValue id="creditScreeningFee" label={t("listings.sections.creditScreeningFee")}>
              {getDetailFieldString(listing.creditScreeningFee)}
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      )}
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
