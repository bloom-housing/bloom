import React, { useContext, useMemo } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Link } from "@bloom-housing/ui-seeds"
import { useListingsMultiselectQuestionList } from "../../lib/hooks"
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
  const { data, loading } = useListingsMultiselectQuestionList(multiselectQuestion.id)

  const listingsTableData = useMemo(
    () =>
      data?.map((listing) => ({
        name: {
          content: <Link href={`/listings/${listing.id}`}>{listing.name}</Link>,
        },
      })),
    [data]
  )

  if (loading) {
    return null
  }

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

  if (data?.length > 0) {
    return (
      <Dialog
        isOpen={!!multiselectQuestion}
        onClose={onClose}
        ariaLabelledBy="preference-changes-modal-header"
        ariaDescribedBy="preference-changes-modal-description"
      >
        <Dialog.Header id="preference-changes-modal-header">
          {t("settings.preferenceChangesRequired")}
        </Dialog.Header>
        <Dialog.Content>
          <div className="pb-3" id="preference-changes-modal-description">
            {t("settings.preferenceDeleteError")}
          </div>
          <MinimalTable
            headers={{ name: "listings.listingName" }}
            data={listingsTableData}
            cellClassName={" "}
          />
        </Dialog.Content>
        <Dialog.Footer>
          <Button type="button" variant="primary" onClick={onClose} size="sm">
            {t("t.done")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    )
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
