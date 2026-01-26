import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { MultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type PreferenceDeleteModalProps = {
  onClose: () => void
  multiselectQuestion: MultiselectQuestion
}

export const PreferenceDeleteModal = ({
  multiselectQuestion,
  onClose,
}: PreferenceDeleteModalProps) => {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const deletePreference = () => {
    multiselectQuestionsService
      .delete({
        body: { id: multiselectQuestion.id },
      })
      .then(() => {
        addToast(t("settings.preferenceAlertDeleted"), { variant: "success" })
        onClose()
      })
      .catch((e) => {
        addToast(t("errors.alert.timeoutPleaseTryAgain"), { variant: "alert" })
        console.log(e)
      })
  }

  return (
    <Dialog
      isOpen={!!multiselectQuestion}
      onClose={onClose}
      ariaLabelledBy="preference-delete-modal-header"
      ariaDescribedBy="preference-delete-modal-description"
    >
      <Dialog.Header id="preference-delete-modal-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="preference-delete-modal-description">
        {t("settings.preferenceDeleteConfirmation")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={deletePreference} size="sm">
          {t("t.delete")}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          ariaLabel={t("t.cancel")}
          variant="primary-outlined"
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
