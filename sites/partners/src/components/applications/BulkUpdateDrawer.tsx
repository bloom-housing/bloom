import React from "react"
import { Button, Card, Drawer, Heading } from "@bloom-housing/ui-seeds"
import { Dropzone, t } from "@bloom-housing/ui-components"

interface BulkUpdateDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const BulkUpdateDrawer = ({ isOpen, onClose }: BulkUpdateDrawerProps) => {
  const csvUploader = (file: File) => {
    console.log(file)
  }

  const downloadTemplate = () => {
    console.log("download template")
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
            <Button variant="primary-outlined" onClick={downloadTemplate}>
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
            <Dropzone
              id="bulk-update-upload"
              uploader={csvUploader}
              label={t("applications.bulkUpdateStep3DropzoneLabel")}
              accept=".csv"
            />
            <p>{t("applications.bulkUpdateStep3Body")}</p>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button variant="primary-outlined" onClick={onClose}>
          {t("t.close")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

export default BulkUpdateDrawer
