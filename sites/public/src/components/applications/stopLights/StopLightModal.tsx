import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog, Message } from "@bloom-housing/ui-seeds"
import { StopLightRule } from "../../../lib/applications/stopLights/stopLightRules"

interface StopLightDialogProps {
  isOpen: boolean
  rule: StopLightRule | null
  variant: "alert" | "warn"
  idPrefix: "red-light" | "yellow-light"
  onClose: () => void
  // takes the rule so the null check below is the only one either modal needs
  renderFooter: (rule: StopLightRule) => React.ReactNode
}

export interface RedLightModalProps {
  isOpen: boolean
  rule: StopLightRule | null
  onEdit: () => void
  onReturnToListings: () => void
}

export interface YellowLightModalProps {
  isOpen: boolean
  rule: StopLightRule | null
  onCancel: () => void
  onAcknowledge: () => void
}

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

// everything the two lights share: a step carries at most one rule, so this renders that
// rule or nothing at all
const StopLightDialog = (props: StopLightDialogProps) => {
  const { rule, idPrefix } = props

  if (!rule) return null

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      ariaLabelledBy={`${idPrefix}-modal-header`}
      ariaDescribedBy={`${idPrefix}-modal-content`}
    >
      <Dialog.Header id={`${idPrefix}-modal-header`}>{t(rule.modalTitle)}</Dialog.Header>
      <Dialog.Content id={`${idPrefix}-modal-content`}>
        <Message fullwidth variant={props.variant}>
          <strong>{t(rule.alertTitle)}</strong> <p className="seeds-body-text">{t(rule.body)}</p>
        </Message>
      </Dialog.Content>
      <Dialog.Footer>{props.renderFooter(rule)}</Dialog.Footer>
    </Dialog>
  )
}

const RedLightModal = (props: RedLightModalProps) => (
  <StopLightDialog
    isOpen={props.isOpen}
    rule={props.rule}
    variant="alert"
    idPrefix="red-light"
    onClose={props.onEdit}
    renderFooter={(rule) => (
      <>
        <Button
          type="button"
          variant="primary"
          size="sm"
          id="red-light-modal-return-button"
          onClick={props.onReturnToListings}
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
    )}
  />
)

const YellowLightModal = (props: YellowLightModalProps) => (
  <StopLightDialog
    isOpen={props.isOpen}
    rule={props.rule}
    variant="warn"
    idPrefix="yellow-light"
    onClose={props.onCancel}
    renderFooter={() => (
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
  />
)

export { RedLightModal, YellowLightModal }
