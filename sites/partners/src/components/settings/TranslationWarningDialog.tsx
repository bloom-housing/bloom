import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { TranslationIssue } from "../../lib/translationEditor"

type TranslationWarningDialogProps = {
  /** Keys whose save or revert would take a section off the site. */
  hidingKeys: string[]
  /** Keys whose entered value drops a placeholder or plural form the English text has. */
  tokenIssues: TranslationIssue[]
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

const missingLabel = (issue: TranslationIssue) =>
  [
    ...issue.missingTokens.map((token) => `%{${token}}`),
    ...(issue.missingPluralForms ? [t("translations.tokenWarningPluralForm")] : []),
  ].join(", ")

export const TranslationWarningDialog = ({
  hidingKeys,
  tokenIssues,
  isLoading,
  onClose,
  onConfirm,
}: TranslationWarningDialogProps) => (
  <Dialog
    isOpen={hidingKeys.length > 0 || tokenIssues.length > 0}
    onClose={onClose}
    ariaLabelledBy="translation-warning-header"
    ariaDescribedBy="translation-warning-description"
  >
    <Dialog.Header id="translation-warning-header">{t("translations.warningTitle")}</Dialog.Header>
    <Dialog.Content>
      <div id="translation-warning-description">
        {tokenIssues.length > 0 && (
          <section className={hidingKeys.length > 0 ? "pb-6" : undefined}>
            <p className="font-semibold">{t("translations.tokenWarningTitle")}</p>
            <p className="pb-2">{t("translations.tokenWarningDescription")}</p>
            <ul className="list-disc pl-6">
              {tokenIssues.map((issue) => (
                <li key={issue.key}>{`${issue.key} (${missingLabel(issue)})`}</li>
              ))}
            </ul>
          </section>
        )}
        {hidingKeys.length > 0 && (
          <section>
            <p className="font-semibold">{t("translations.hideSectionTitle")}</p>
            <p className="pb-2">{t("translations.hideSectionDescription")}</p>
            <ul className="list-disc pl-6">
              {hidingKeys.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Dialog.Content>
    <Dialog.Footer>
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={isLoading}
        onClick={onConfirm}
        id="confirmTranslationWarning"
      >
        {t("t.confirm")}
      </Button>
      <Button type="button" variant="secondary" size="sm" disabled={isLoading} onClick={onClose}>
        {t("t.cancel")}
      </Button>
    </Dialog.Footer>
  </Dialog>
)
