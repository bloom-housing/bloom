import React, { useContext } from "react"
import { t, ExpandableText } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailFieldDate } from "./helpers"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailListingNotes = () => {
  const listing = useContext(ListingContext)

  if (!listing.requestedChanges || !(listing.status === ListingsStatusEnum.changesRequested)) return

  return (
    <SectionWithGrid heading={t("listings.approval.listingNotes")} inset>
      <Grid.Row columns={3}>
        <FieldValue id="requestedChanges" label={t("listings.approval.changeRequestSummary")}>
          <ExpandableText
            buttonClassName="ml-4"
            strings={{
              readMore: t("t.more"),
              readLess: t("t.less"),
            }}
          >
            {getDetailFieldString(listing.requestedChanges)}
          </ExpandableText>
        </FieldValue>
        <FieldValue id="requestedChangesDate" label={t("listings.approval.requestDate")}>
          {getDetailFieldDate(listing.requestedChangesDate)}
        </FieldValue>

        {listing?.requestedChangesUser?.name && (
          <FieldValue id="requestedChangesUser" label={t("listings.approval.requestedBy")}>
            {`${listing.requestedChangesUser.name}`}
          </FieldValue>
        )}
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailListingNotes
