import React, { useContext } from "react"
import { t, MinimalTable, StandardTableData } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ApplicationMethodsTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"
import { pdfFileNameFromFileId } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailApplicationTypes = () => {
  const listing = useContext(ListingContext)

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
        <FieldValue id="digitalApplication" label={"Online Applications"}>
          {getDetailBoolean(listing.digitalApplication)}
        </FieldValue>
        {digitalMethod && (
          <FieldValue id="digitalMethod.type" label={"Common Digital Application"}>
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
    </SectionWithGrid>
  )
}

export default DetailApplicationTypes
