import React from "react"
import { Button, Card, Drawer, Heading } from "@bloom-housing/ui-seeds"
import { Dropzone, MinimalTable, StandardTableData, t } from "@bloom-housing/ui-components"
import { useBulkApplicationCsvUpload, useBulkApplicationTemplateExport } from "../../lib/hooks"

interface BulkUpdateDrawerProps {
  isOpen: boolean
  listingId: string
  onClose: () => void
}

const BulkUpdateDrawer = ({ isOpen, onClose, listingId }: BulkUpdateDrawerProps) => {
  const { onExport } = useBulkApplicationTemplateExport(listingId)
  const { uploadToS3, resetUpload, fileUploadData, progressValue } = useBulkApplicationCsvUpload()

  const csvUploader = async (file: File) => {
    await uploadToS3(file, listingId)
  }

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
              <MinimalTable headers={bulkApplicationHeaders} data={bulkApplicationTableRows} />
            )}
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button variant="primary-outlined" onClick={onClose}>
          {t("t.close")}
        </Button>
        <Button disabled={!fileUploadData} variant="primary">
          {t("t.uploadFile")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export default BulkUpdateDrawer
