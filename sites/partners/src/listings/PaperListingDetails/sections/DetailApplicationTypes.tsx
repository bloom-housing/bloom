import React, { useContext } from "react"
import {
  t,
  GridSection,
  GridCell,
  MinimalTable,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ApplicationMethodType } from "@bloom-housing/backend-core/types"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"

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
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationTypesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem id="digitalApplication" label={"Online Applications"}>
            {getDetailBoolean(listing.digitalApplication)}
          </ViewItem>
        </GridCell>
        {digitalMethod && (
          <GridCell>
            <ViewItem id="digitalMethod.type" label={"Common Digital Application"}>
              {digitalMethod?.type === ApplicationMethodType.ExternalLink ? t("t.no") : t("t.yes")}
            </ViewItem>
          </GridCell>
        )}
        {digitalMethod?.type === ApplicationMethodType.ExternalLink && (
          <ViewItem
            id="customOnlineApplicationUrl"
            label={t("listings.customOnlineApplicationUrl")}
          >
            {digitalMethod.externalReference}
          </ViewItem>
        )}
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="paperApplication" label={"Paper Applications"}>
            {getDetailBoolean(listing.paperApplication)}
          </ViewItem>
        </GridCell>
        {paperApplicationsTableRows.length > 0 && (
          <GridCell>
            <ViewItem label={"Paper Applications"}>
              <MinimalTable
                id="paperApplicationTable"
                headers={paperApplicationsTableHeaders}
                data={paperApplicationsTableRows}
                flushLeft={true}
              ></MinimalTable>
            </ViewItem>
          </GridCell>
        )}
      </GridSection>

      <GridSection columns={2}>
        <GridCell>
          <ViewItem id="referralOpportunity" label={"Referral"}>
            {getDetailBoolean(listing.referralOpportunity)}
          </ViewItem>
        </GridCell>
        {referralMethod && (
          <>
            <GridCell>
              <ViewItem id="referralContactPhone" label={t("listings.referralContactPhone")}>
                {referralMethod.phoneNumber}
              </ViewItem>
            </GridCell>
            <GridCell>
              <ViewItem id="referralSummary" label={t("listings.referralSummary")}>
                {referralMethod.externalReference}
              </ViewItem>
            </GridCell>
          </>
        )}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationTypes
