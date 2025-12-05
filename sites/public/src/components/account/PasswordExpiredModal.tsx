import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import React, { useCallback } from "react"
import { useRouter } from "next/router"

export type ResendConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
}

const PasswordExpiredModal = ({ isOpen, onClose }: ResendConfirmationModalProps) => {
  const router = useRouter()

  const closeCallback = useCallback(() => {
    onClose()
    window.scrollTo(0, 0)
  }, [onClose])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeCallback}
      ariaLabelledBy="confirm-add-application-dialog-header"
    >
      <Dialog.Header id="confirm-add-application-dialog-header">
        {t("account.pwdless.passwordOutdatedModalHeader")}
      </Dialog.Header>
      <Dialog.Content>{t("account.pwdless.passwordOutdatedModalContent")}</Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          variant="primary"
          onClick={() => router.push("/forgot-password")}
          size="sm"
        >
          {t("account.pwdless.continue")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { PasswordExpiredModal as default, PasswordExpiredModal }
