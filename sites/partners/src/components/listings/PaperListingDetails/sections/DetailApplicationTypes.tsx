import React, { useContext } from "react"
import {
  t,
  GridSection,
  GridCell,
  MinimalTable,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ApplicationMethodType } from "@bloom-housing/backend-core/types"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"
import { pdfFileNameFromFileId } from "../../../../lib/helpers"

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
        fileName: { content: pdfFileNameFromFileId(item.file.fileId) },
        language: { content: t(`languages.${item.language}`) },
      })
    })
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationTypesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <FieldValue id="digitalApplication" label={"Online Applications"}>
            {getDetailBoolean(listing.digitalApplication)}
          </FieldValue>
        </GridCell>
        {digitalMethod && (
          <GridCell>
            <FieldValue id="digitalMethod.type" label={"Common Digital Application"}>
              {digitalMethod?.type === ApplicationMethodType.ExternalLink ? t("t.no") : t("t.yes")}
            </FieldValue>
          </GridCell>
        )}
        {digitalMethod?.type === ApplicationMethodType.ExternalLink && (
          <FieldValue
            id="customOnlineApplicationUrl"
            label={t("listings.customOnlineApplicationUrl")}
          >
            {digitalMethod.externalReference}
          </FieldValue>
        )}
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="paperApplication" label={"Paper Applications"}>
            {getDetailBoolean(listing.paperApplication)}
          </FieldValue>
        </GridCell>
        {paperApplicationsTableRows.length > 0 && (
          <GridCell>
            <FieldValue label={"Paper Applications"}>
              <MinimalTable
                id="paperApplicationTable"
                headers={paperApplicationsTableHeaders}
                data={paperApplicationsTableRows}
                flushLeft={true}
              ></MinimalTable>
            </FieldValue>
          </GridCell>
        )}
      </GridSection>

      <GridSection columns={2}>
        <GridCell>
          <FieldValue id="referralOpportunity" label={"Referral"}>
            {getDetailBoolean(listing.referralOpportunity)}
          </FieldValue>
        </GridCell>
        {referralMethod && (
          <>
            <GridCell>
              <FieldValue id="referralContactPhone" label={t("listings.referralContactPhone")}>
                {referralMethod.phoneNumber}
              </FieldValue>
            </GridCell>
            <GridCell>
              <FieldValue id="referralSummary" label={t("listings.referralSummary")}>
                {referralMethod.externalReference}
              </FieldValue>
            </GridCell>
          </>
        )}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationTypes
