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
      <Dialog.Header id="confirm-add-application-dialog-header">Password Expired</Dialog.Header>
      <Dialog.Content>
        The password tied to your account has expired. Please reset it to continue.
      </Dialog.Content>
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
