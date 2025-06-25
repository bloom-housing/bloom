import React, { useContext } from "react"
import { t, MinimalTable, StandardTableData } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import {
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"
import { pdfFileNameFromFileId } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"

const DetailApplicationTypes = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const disableCommonApplication = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableCommonApplication,
    listing?.jurisdictions?.id
  )

  const digitalMethod = listing.applicationMethods.find(
    (method) =>
      method.type === ApplicationMethodsTypeEnum.Internal ||
      method.type === ApplicationMethodsTypeEnum.ExternalLink
  )
  const paperMethod = listing.applicationMethods.find(
    (method) => method.type === ApplicationMethodsTypeEnum.FileDownload
  )

  const paperApplicationsTableHeaders = {
    fileName: "t.fileName",
    language: "t.language",
  }

  const paperApplicationsTableRows: StandardTableData = []

  if (paperMethod) {
    paperMethod.paperApplications.forEach((item) => {
      paperApplicationsTableRows.push({
        fileName: { content: pdfFileNameFromFileId(item.assets.fileId) },
        language: { content: t(`languages.${item.language}`) },
      })
    })
  }

  return (
    <SectionWithGrid heading={t("listings.sections.applicationTypesTitle")} inset>
      <Grid.Row columns={2}>
        <FieldValue id="digitalApplication" label={t("listings.applicationType.onlineApplication")}>
          {getDetailBoolean(listing.digitalApplication)}
        </FieldValue>
        {!disableCommonApplication && digitalMethod && (
          <FieldValue
            id="digitalMethod.type"
            label={t("listings.applicationType.digitalApplication")}
          >
            {digitalMethod?.type === ApplicationMethodsTypeEnum.ExternalLink
              ? t("t.no")
              : t("t.yes")}
          </FieldValue>
        )}
        {digitalMethod?.type === ApplicationMethodsTypeEnum.ExternalLink && (
          <FieldValue
            id="customOnlineApplicationUrl"
            label={t("listings.customOnlineApplicationUrl")}
          >
            {digitalMethod.externalReference}
          </FieldValue>
        )}
      </Grid.Row>
      <Grid.Row>
        <FieldValue id="paperApplication" label={t("listings.applicationType.paperApplication")}>
          {getDetailBoolean(listing.paperApplication)}
        </FieldValue>
      </Grid.Row>
      {paperApplicationsTableRows.length > 0 && (
        <Grid.Row>
          <FieldValue label={t("listings.applicationType.paperApplication")}>
            <MinimalTable
              id="paperApplicationTable"
              headers={paperApplicationsTableHeaders}
              data={paperApplicationsTableRows}
              flushLeft={true}
            ></MinimalTable>
          </FieldValue>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailApplicationTypes
