import React, { useContext, useMemo } from "react"
import { AlertTypes, MinimalTable, Modal, t } from "@bloom-housing/ui-components"
import { Button, Link } from "@bloom-housing/ui-seeds"
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
      <Modal
        title={t("settings.preferenceChangesRequired")}
        open={!!multiselectQuestion}
        onClose={onClose}
        scrollableModal
        actions={[
          <Button type="button" variant="primary" onClick={onClose} size="sm">
            {t("t.done")}
          </Button>,
        ]}
      >
        <div>
          <div className="pb-3">{t("settings.preferenceDeleteError")}</div>
          <MinimalTable
            headers={{ name: "listings.listingName" }}
            data={listingsTableData}
            cellClassName={" "}
          />
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title={t("t.areYouSure")}
      open={!!multiselectQuestion}
      onClose={onClose}
      actions={[
        <Button type="button" variant="alert" onClick={deletePreference} size="sm">
          {t("t.delete")}
        </Button>,
        <Button
          type="button"
          onClick={onClose}
          ariaLabel={t("t.cancel")}
          variant="primary-outlined"
          size="sm"
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <div>{t("settings.preferenceDeleteConfirmation")}</div>
    </Modal>
  )
}
