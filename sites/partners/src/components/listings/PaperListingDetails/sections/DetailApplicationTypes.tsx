import React, { useContext } from "react"
import { t, MinimalTable, StandardTableData } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationMethodType } from "@bloom-housing/backend-core/types"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailApplicationTypes = () => {
  const listing = useContext(ListingContext)

  const digitalMethod = listing.applicationMethods.find(
    (method) =>
      method.type === ApplicationMethodType.Internal ||
      method.type === ApplicationMethodType.ExternalLink
  )
  const paperMethod = listing.applicationMethods.find(
    (method) => method.type === ApplicationMethodType.FileDownload
  )
  const referralMethod = listing.applicationMethods.find(
    (method) => method.type === ApplicationMethodType.Referral
  )

  const paperApplicationsTableHeaders = {
    fileName: "t.fileName",
    language: "t.language",
  }

  const paperApplicationsTableRows: StandardTableData = []

  if (paperMethod) {
    paperMethod.paperApplications.forEach((item) => {
      paperApplicationsTableRows.push({
        fileName: { content: `${item.file.fileId.split("/").slice(-1).join()}.pdf` },
        language: { content: t(`languages.${item.language}`) },
      })
    })
  }

  return (
    <SectionWithGrid heading={t("listings.sections.applicationTypesTitle")} inset>
      <Grid.Row columns={2}>
        <FieldValue id="digitalApplication" label={"Online Applications"}>
          {getDetailBoolean(listing.digitalApplication)}
        </FieldValue>
        {digitalMethod && (
          <FieldValue id="digitalMethod.type" label={"Common Digital Application"}>
            {digitalMethod?.type === ApplicationMethodType.ExternalLink ? t("t.no") : t("t.yes")}
          </FieldValue>
        )}
        {digitalMethod?.type === ApplicationMethodType.ExternalLink && (
          <FieldValue
            id="customOnlineApplicationUrl"
            label={t("listings.customOnlineApplicationUrl")}
          >
            {digitalMethod.externalReference}
          </FieldValue>
        )}
      </Grid.Row>
      <Grid.Row>
        <FieldValue id="paperApplication" label={"Paper Applications"}>
          {getDetailBoolean(listing.paperApplication)}
        </FieldValue>
      </Grid.Row>
      {paperApplicationsTableRows.length > 0 && (
        <Grid.Row>
          <FieldValue label={"Paper Applications"}>
            <MinimalTable
              id="paperApplicationTable"
              headers={paperApplicationsTableHeaders}
              data={paperApplicationsTableRows}
              flushLeft={true}
            ></MinimalTable>
          </FieldValue>
        </Grid.Row>
      )}

      <Grid.Row columns={2}>
        <FieldValue id="referralOpportunity" label={"Referral"}>
          {getDetailBoolean(listing.referralOpportunity)}
        </FieldValue>
        {referralMethod && (
          <>
            <FieldValue id="referralContactPhone" label={t("listings.referralContactPhone")}>
              {referralMethod.phoneNumber}
            </FieldValue>
            <FieldValue id="referralSummary" label={t("listings.referralSummary")}>
              {referralMethod.externalReference}
            </FieldValue>
          </>
        )}
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailApplicationTypes
