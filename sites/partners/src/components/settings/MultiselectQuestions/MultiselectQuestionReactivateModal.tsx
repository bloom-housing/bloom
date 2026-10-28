import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { MultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type MultiselectQuestionReactivateModalProps = {
  onClose: () => void
  multiselectQuestion: MultiselectQuestion
}

const MultiselectQuestionReactivateModal = ({
  multiselectQuestion,
  onClose,
}: MultiselectQuestionReactivateModalProps) => {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const reActivateMultiselectQuestion = () => {
    multiselectQuestionsService
      .reActivate({
        body: { id: multiselectQuestion.id },
      })
      .then(() => {
        addToast(t("settings.preferenceAlertReactivated"), { variant: "success" })
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
      ariaLabelledBy="preference-reactivate-modal-header"
      ariaDescribedBy="preference-reactivate-modal-description"
    >
      <Dialog.Header id="preference-reactivate-modal-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="preference-reactivate-modal-description">
        {t("settings.preferenceReactivateConfirmation")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={reActivateMultiselectQuestion} size="sm">
          {t("t.continue")}
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

export default MultiselectQuestionReactivateModal
