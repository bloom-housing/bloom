import React from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Grid } from "@bloom-housing/ui-seeds"
import styles from "./AccountTypeDialog.module.scss"

export type AccountTypeDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export const AccountTypeDialog = ({ isOpen, onClose }: AccountTypeDialogProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()
  const router = useRouter()

  const accountType = watch("accountType")

  const onSubmit = () => {
    if (!accountType || accountType === "applicant") {
      void router.push("/create-account")
    } else if (accountType === "advocate") {
      void router.push("/create-advocate-account")
    }
  }
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabelledBy="account-type-dialog-header">
      <Dialog.Header id="account-type-dialog-header">
        {t("advocateAccount.accountType.header")}
      </Dialog.Header>
      <Dialog.Content>
        <fieldset>
          <legend className={"seeds-m-be-4"}>{t("advocateAccount.accountType.legend")}</legend>
          <Grid.Row columns={4}>
            <Grid.Cell className={`seeds-grid-span-2 ${styles["account-type-option"]}`}>
              <Field
                name="accountType"
                type="radio"
                register={register}
                id={"applicant"}
                label={t("advocateAccount.accountType.applicantLabel")}
                inputProps={{
                  value: "applicant",
                  defaultChecked: true,
                }}
                subNote={t("advocateAccount.accountType.applicantSubNote")}
                className={styles["account-type-field"]}
              />
            </Grid.Cell>
            <Grid.Cell className={`seeds-grid-span-2 ${styles["account-type-option"]}`}>
              <Field
                name="accountType"
                type="radio"
                register={register}
                id={"advocate"}
                label={t("advocateAccount.accountType.advocateLabel")}
                inputProps={{
                  value: "advocate",
                }}
                subNote={t("advocateAccount.accountType.advocateSubNote")}
                className={styles["account-type-field"]}
              />
            </Grid.Cell>
          </Grid.Row>
        </fieldset>
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="submit" variant="primary" onClick={onSubmit} size="sm">
          {t("t.getStarted")}
        </Button>
        <Button
          variant="primary-outlined"
          onClick={() => {
            onClose()
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
