import React from "react"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { Dropzone, t } from "@bloom-housing/ui-components"

interface BulkUpdateModalProps {
  isOpen: boolean
  onClose: () => void
}

const BulkUpdateModal = ({ isOpen, onClose }: BulkUpdateModalProps) => {
  const csvUploader = (file: File) => {
    console.log(file)
  }

  const downloadTemplate = () => {
    console.log("download template")
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabelledBy="bulk-update-modal-header">
      <Dialog.Header id="bulk-update-modal-header">
        {t("applications.bulkUpdateModalTitle")}
      </Dialog.Header>
      <Dialog.Content>
        <p>{t("applications.bulkUpdateModalSubtitle")}</p>

        <h3>{t("applications.bulkUpdateStep1Title")}</h3>
        <p>{t("applications.bulkUpdateStep1Body")}</p>
        <Button variant="primary-outlined" onClick={downloadTemplate}>
          {t("applications.bulkUpdateDownloadTemplate")}
        </Button>

        <h3>{t("applications.bulkUpdateStep2Title")}</h3>
        <p>{t("applications.bulkUpdateStep2Body")}</p>

        <h3>{t("applications.bulkUpdateStep3Title")}</h3>
        <Dropzone
          id="bulk-update-upload"
          uploader={csvUploader}
          label={t("applications.bulkUpdateStep3DropzoneLabel")}
          accept=".csv"
        />
        <p>{t("applications.bulkUpdateStep3Body")}</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="primary-outlined" onClick={onClose}>
          {t("t.close")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export default BulkUpdateModal
