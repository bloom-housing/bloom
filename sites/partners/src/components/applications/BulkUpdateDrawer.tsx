import React, { useCallback, useContext, useState } from "react"
import { Button, Card, Drawer, Heading } from "@bloom-housing/ui-seeds"
import {
  AlertBox,
  Dropzone,
  MinimalTable,
  StandardTableData,
  t,
} from "@bloom-housing/ui-components"
import { useBulkApplicationCsvUpload, useBulkApplicationTemplateExport } from "../../lib/hooks"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"

interface BulkUpdateDrawerProps {
  isOpen: boolean
  listingId: string
  onClose: () => void
}

const BulkUpdateDrawer = ({ isOpen, onClose, listingId }: BulkUpdateDrawerProps) => {
  const { applicationsService } = useContext(AuthContext)
  const { onExport } = useBulkApplicationTemplateExport(listingId)
  const [csvError, setCsvError] = useState<string>("")
  const { uploadToS3, resetUpload, fileUploadData, progressValue } = useBulkApplicationCsvUpload()

  const csvUploader = useCallback(
    async (file: File) => {
      await uploadToS3(file, listingId)
    },
    [uploadToS3, listingId]
  )

  const processBulkCsv = useCallback(async () => {
    if (fileUploadData && fileUploadData.s3Key) {
      let jobId: string
      try {
        jobId = await applicationsService.bulkUpdateApplications({
          body: {
            s3Key: fileUploadData.s3Key,
            listingId: listingId,
          },
        })
      } catch (e) {
        setCsvError(e?.response?.data?.message ?? t("applications.bulkUpdateModalProcessingError"))
      }

      console.log(JSON.stringify(jobId, null, 2))
    }
  }, [applicationsService, fileUploadData, listingId])

  const bulkApplicationHeaders = {
    fileName: "t.fileName",
    actions: "",
  }

  const bulkApplicationTableRows: StandardTableData = []
  if (fileUploadData && fileUploadData.url !== "") {
    bulkApplicationTableRows.push({
      fileName: { content: `${fileUploadData.id}` },
      actions: {
        content: (
          <Button
            type="button"
            size="sm"
            className="font-semibold text-alert"
            onClick={resetUpload}
            variant="text"
          >
            {t("t.delete")}
          </Button>
        ),
      },
    })
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} ariaLabelledBy="bulk-update-drawer-header">
      <Drawer.Header id="bulk-update-drawer-header">
        {t("applications.bulkUpdateModalTitle")}
      </Drawer.Header>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <Heading priority={2} size="xl" className="seeds-m-be-content">
              {t("applications.bulkUpdateModalSubtitle")}
            </Heading>

            <Heading priority={3} size="lg" className="seeds-m-be-header">
              {t("applications.bulkUpdateStep1Title")}
            </Heading>
            <p className="seeds-m-be-content">{t("applications.bulkUpdateStep1Body")}</p>
            <Button variant="primary-outlined" onClick={() => onExport()}>
              {t("applications.bulkUpdateDownloadTemplate")}
            </Button>
          </Card.Section>
          <Card.Section>
            <Heading priority={3} size="lg" className="seeds-m-be-header">
              {t("applications.bulkUpdateStep2Title")}
            </Heading>
            <p>{t("applications.bulkUpdateStep2Body")}</p>
          </Card.Section>
          <Card.Section>
            <Heading priority={3} size="lg" className="seeds-m-be-header">
              {t("applications.bulkUpdateStep3Title")}
            </Heading>
            <p className="seeds-m-be-content">{t("applications.bulkUpdateStep3Body")}</p>
            {!fileUploadData ? (
              <Dropzone
                id="bulk-update-upload"
                uploader={csvUploader}
                label={t("applications.bulkUpdateStep3DropzoneLabel")}
                accept=".csv"
                progress={progressValue}
              />
            ) : (
              <div className="flex flex-col gap-1">
                <MinimalTable headers={bulkApplicationHeaders} data={bulkApplicationTableRows} />
                {csvError && <AlertBox type="alert">{csvError}</AlertBox>}
              </div>
            )}
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button variant="primary-outlined" onClick={onClose}>
          {t("t.close")}
        </Button>
        <Button disabled={!fileUploadData || !!csvError} variant="primary" onClick={processBulkCsv}>
          {t("t.uploadFile")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export default BulkUpdateDrawer
