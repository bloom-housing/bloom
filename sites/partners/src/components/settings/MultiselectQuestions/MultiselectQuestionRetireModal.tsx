import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { MultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type MultiselectQuestionRetireModalProps = {
  onClose: () => void
  multiselectQuestion: MultiselectQuestion
}

const MultiselectQuestionRetireModal = ({
  multiselectQuestion,
  onClose,
}: MultiselectQuestionRetireModalProps) => {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const retireMultiselectQuestion = () => {
    multiselectQuestionsService
      .retire({
        body: { id: multiselectQuestion.id },
      })
      .then(() => {
        addToast(t("settings.preferenceAlertRetired"), { variant: "success" })
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
      ariaLabelledBy="preference-retire-modal-header"
      ariaDescribedBy="preference-retire-modal-description"
    >
      <Dialog.Header id="preference-retire-modal-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="preference-retire-modal-description">
        {t("settings.preferenceRetireConfirmation")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={retireMultiselectQuestion} size="sm">
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

export default MultiselectQuestionRetireModal
