import React from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog, Message } from "@bloom-housing/ui-seeds"
import { StopLightRule } from "../../../lib/applications/stopLights/stopLightRules"

interface StopLightModalCommonProps {
  isOpen: boolean
  rules: StopLightRule[]
}

interface RedStopLightModalProps extends StopLightModalCommonProps {
  light: "red"
  onEdit: () => void
}

interface YellowStopLightModalProps extends StopLightModalCommonProps {
  light: "yellow"
  onCancel: () => void
  onAcknowledge: () => void
}

export type StopLightModalProps = RedStopLightModalProps | YellowStopLightModalProps

// Dialog's focus trap restores focus in a setTimeout(0) from the same click handler.
// rAF then setTimeout(0) queues our focus after that restore.
const deferFocus = (focus: () => void) => {
  window.requestAnimationFrame(() => window.setTimeout(focus, 0))
}

const focusEditFieldAnchor = (anchor?: string) => {
  if (!anchor) return

  deferFocus(() => {
    document.getElementById(anchor)?.focus()
  })
}

const StopLightModal = (props: StopLightModalProps) => {
  const router = useRouter()

  if (props.rules.length === 0) return null

  const rule = props.rules[0]
  const idPrefix = `${props.light}-light`
  const onClose = props.light === "red" ? props.onEdit : props.onCancel

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={onClose}
      ariaLabelledBy={`${idPrefix}-modal-header`}
      ariaDescribedBy={`${idPrefix}-modal-content`}
    >
      <Dialog.Header id={`${idPrefix}-modal-header`}>{t(rule.modalTitle)}</Dialog.Header>
      <Dialog.Content id={`${idPrefix}-modal-content`}>
        <Message fullwidth variant={props.light === "red" ? "alert" : "warn"}>
          <strong>{t(rule.alertTitle)}</strong> <p className="seeds-body-text">{t(rule.body)}</p>
        </Message>
      </Dialog.Content>
      <Dialog.Footer>
        {props.light === "red" ? (
          <>
            <Button
              type="button"
              variant="primary"
              size="sm"
              id="red-light-modal-return-button"
              onClick={() => {
                void router.push(`/${router.locale}/listings`)
              }}
            >
              {t("stopLights.returnToListing")}
            </Button>
            <Button
              type="button"
              variant="primary-outlined"
              size="sm"
              id="red-light-modal-edit-button"
              onClick={() => {
                props.onEdit()
                focusEditFieldAnchor(rule.editFieldAnchor)
              }}
            >
              {t("stopLights.updateAnswer")}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="primary"
              size="sm"
              id="yellow-light-modal-continue-button"
              onClick={props.onAcknowledge}
            >
              {t("stopLights.continue")}
            </Button>
            <Button
              type="button"
              variant="primary-outlined"
              size="sm"
              id="yellow-light-modal-cancel-button"
              onClick={props.onCancel}
            >
              {t("stopLights.updateAnswer")}
            </Button>
          </>
        )}
      </Dialog.Footer>
    </Dialog>
  )
}

export { StopLightModal as default, StopLightModal }
