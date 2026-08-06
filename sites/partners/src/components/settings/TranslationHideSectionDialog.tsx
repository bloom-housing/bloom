import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"

type TranslationHideSectionDialogProps = {
  /** Keys whose save or revert would take a section off the site. */
  keys: string[]
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * Confirms an edit that removes a section rather than changing its wording.
 *
 * These keys have no base value, so nothing falls back once the override is emptied or reverted.
 */
export const TranslationHideSectionDialog = ({
  keys,
  isLoading,
  onClose,
  onConfirm,
}: TranslationHideSectionDialogProps) => (
  <Dialog
    isOpen={keys.length > 0}
    onClose={onClose}
    ariaLabelledBy="translation-hide-section-header"
    ariaDescribedBy="translation-hide-section-description"
  >
    <Dialog.Header id="translation-hide-section-header">
      {t("translations.hideSectionTitle")}
    </Dialog.Header>
    <Dialog.Content>
      <p id="translation-hide-section-description" className="pb-4">
        {t("translations.hideSectionDescription")}
      </p>
      <ul className="list-disc pl-6">
        {keys.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </Dialog.Content>
    <Dialog.Footer>
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={isLoading}
        onClick={onConfirm}
        id="confirmHideSection"
      >
        {t("t.confirm")}
      </Button>
      <Button type="button" variant="secondary" size="sm" disabled={isLoading} onClick={onClose}>
        {t("t.cancel")}
      </Button>
    </Dialog.Footer>
  </Dialog>
)
