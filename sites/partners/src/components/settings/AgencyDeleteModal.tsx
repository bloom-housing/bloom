import React, { useContext, useMemo } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useUserList } from "../../lib/hooks"
import styles from "./DeleteModal.module.scss"

type AgencyDeleteModalProps = {
  onClose: () => void
  agency: Agency
}

export const AgencyDeleteModal = ({ agency, onClose }: AgencyDeleteModalProps) => {
  const { agencyService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const { data: usersData, loading: usersLoading } = useUserList({
    page: 1,
    limit: "all",
    filter: { agencyId: agency.id, isAdvocateUser: true },
  })

  const usersTableData = useMemo(
    () =>
      usersData?.items?.map((user) => ({
        name: { content: `${user.firstName} ${user.lastName}` },
        email: { content: user.email },
      })),
    [usersData]
  )

  if (usersLoading) {
    return null
  }

  const deleteAgency = () => {
    agencyService
      .delete({
        body: { id: agency.id },
      })
      .then(() => {
        addToast(t("agencies.agencyAlertDeleted"), { variant: "success" })
        onClose()
      })
      .catch((e) => {
        addToast(t("errors.alert.timeoutPleaseTryAgain"), { variant: "alert" })
        console.log(e)
      })
  }

  if (usersData?.items?.length > 0) {
    return (
      <Dialog
        isOpen={!!agency}
        onClose={onClose}
        ariaLabelledBy="agency-in-use-modal-header"
        ariaDescribedBy="agency-in-use-modal-description"
      >
        <Dialog.Header id="agency-in-use-modal-header">{t("agencies.agencyInUse")}</Dialog.Header>
        <Dialog.Content>
          <div className="pb-3" id="agency-in-use-modal-description">
            {t("agencies.agencyDeleteError")}
          </div>
          <div className={styles["table-wrapper"]}>
            <MinimalTable
              headers={{ name: "t.name", email: "t.email" }}
              data={usersTableData}
              cellClassName={" "}
            />
          </div>
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
      isOpen={!!agency}
      onClose={onClose}
      ariaLabelledBy="agency-delete-modal-header"
      ariaDescribedBy="agency-delete-modal-description"
    >
      <Dialog.Header id="agency-delete-modal-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="agency-delete-modal-description">
        {t("agencies.agencyDeleteConfirmation")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={deleteAgency} size="sm">
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
