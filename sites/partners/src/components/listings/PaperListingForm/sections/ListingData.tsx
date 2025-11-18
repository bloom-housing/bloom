import React from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { getDetailFieldDate, getDetailFieldTime } from "../../PaperListingDetails/sections/helpers"

interface ListingIntroProps {
  createdAt?: Date
  jurisdictionName: string
  listingId: string
}

const ListingData = (props: ListingIntroProps) => {
  if (!props.jurisdictionName && !props.listingId) return null
  return (
    <>
      <SectionWithGrid heading={t("listings.details.listingData")}>
        {props.jurisdictionName && (
          <Grid.Cell>
            <FieldValue label={t("t.jurisdiction")}>{props.jurisdictionName}</FieldValue>
          </Grid.Cell>
        )}
        {props.listingId && (
          <Grid.Row columns={5}>
            <Grid.Row>
              <Grid.Cell>
                <FieldValue label={t("listings.details.createdDate")}>
                  {getDetailFieldDate(props.createdAt)}
                  {" at "}
                  {getDetailFieldTime(props.createdAt)}
                </FieldValue>
              </Grid.Cell>
            </Grid.Row>

            <Grid.Cell className={"seeds-grid-span-2"}>
              <FieldValue label={t("listings.details.id")}>{props.listingId}</FieldValue>
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export default ListingData
