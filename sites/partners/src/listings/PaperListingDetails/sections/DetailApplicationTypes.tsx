import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell, MinimalTable } from "@bloom-housing/ui-components"
import { ApplicationMethodType } from "@bloom-housing/backend-core/types"
import { ListingContext } from "../../ListingContext"

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

  const paperApplicationsTableRows = []

  if (paperMethod) {
    paperMethod.paperApplications.forEach((item) => {
      paperApplicationsTableRows.push({
        fileName: `${item.file.fileId.split("/").slice(-1).join()}.pdf`,
        language: t(`languages.${item.language}`),
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
          <ViewItem label={"Online Applications"}>{digitalMethod ? "Yes" : "No"}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={"Common Digital Application"}>
            {digitalMethod?.type === ApplicationMethodType.ExternalLink ? "No" : "Yes"}
          </ViewItem>
        </GridCell>
        {digitalMethod?.type === ApplicationMethodType.ExternalLink && (
          <ViewItem label={t("listings.customOnlineApplicationUrl")}>
            {digitalMethod.externalReference}
          </ViewItem>
        )}
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={"Paper Applications"}>{paperMethod ? "Yes" : "No"}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={"Paper Applications"}>
            <MinimalTable
              headers={paperApplicationsTableHeaders}
              data={paperApplicationsTableRows}
              flushLeft={true}
            ></MinimalTable>
          </ViewItem>
        </GridCell>
      </GridSection>

      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={"Referral"}>{referralMethod ? "Yes" : "No"}</ViewItem>
        </GridCell>
        {referralMethod && (
          <>
            <ViewItem label={t("listings.referralContactPhone")}>
              {referralMethod.phoneNumber}
            </ViewItem>
            <ViewItem label={t("listings.referralSummary")}>
              {referralMethod.externalReference}
            </ViewItem>
          </>
        )}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationTypes
