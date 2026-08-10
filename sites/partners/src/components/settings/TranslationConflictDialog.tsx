import React, { useState } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { ConflictChoice, TranslationConflict } from "../../lib/translationEditor"

type TranslationConflictDialogProps = {
  conflicts: TranslationConflict[]
  isLoading: boolean
  onClose: () => void
  onResolve: (choices: Record<string, ConflictChoice>) => void
}

/**
 * Per-key resolution for a partially saved batch. The edits not named here were already written,
 * so this covers only the keys someone else changed first.
 */
export const TranslationConflictDialog = ({
  conflicts,
  isLoading,
  onClose,
  onResolve,
}: TranslationConflictDialogProps) => {
  // Defaults to keeping the admin's work, so dismissing without a deliberate choice never
  // discards what they typed.
  const [choices, setChoices] = useState<Record<string, ConflictChoice>>(
    Object.fromEntries(conflicts.map((conflict) => [conflict.key, "mine" as ConflictChoice]))
  )

  return (
    <Dialog
      isOpen={conflicts.length > 0}
      onClose={onClose}
      ariaLabelledBy="translation-conflict-header"
      ariaDescribedBy="translation-conflict-description"
    >
      <Dialog.Header id="translation-conflict-header">
        {t("translations.conflictTitle")}
      </Dialog.Header>
      <Dialog.Content>
        <p id="translation-conflict-description" className="pb-4">
          {t("translations.conflictDescription")}
        </p>
        {conflicts.map((conflict) => {
          const mineId = `conflict-${conflict.key}-mine`
          const theirsId = `conflict-${conflict.key}-theirs`

          return (
            <fieldset key={conflict.key} className="pb-6">
              <legend className="font-semibold pb-2">{conflict.key}</legend>
              <div className="pb-2">
                <input
                  type="radio"
                  id={mineId}
                  name={`conflict-${conflict.key}`}
                  value="mine"
                  checked={choices[conflict.key] === "mine"}
                  aria-describedby={`${mineId}-value`}
                  onChange={() =>
                    setChoices((previous) => ({ ...previous, [conflict.key]: "mine" }))
                  }
                />
                <label htmlFor={mineId} className="pl-2 font-semibold">
                  {t("translations.conflictKeepMine")}
                </label>
                <div id={`${mineId}-value`} className="pl-6">
                  {conflict.mine || t("translations.emptyValue")}
                </div>
              </div>
              <div>
                <input
                  type="radio"
                  id={theirsId}
                  name={`conflict-${conflict.key}`}
                  value="theirs"
                  checked={choices[conflict.key] === "theirs"}
                  aria-describedby={`${theirsId}-value`}
                  onChange={() =>
                    setChoices((previous) => ({ ...previous, [conflict.key]: "theirs" }))
                  }
                />
                <label htmlFor={theirsId} className="pl-2 font-semibold">
                  {t("translations.conflictTakeTheirs")}
                </label>
                <div id={`${theirsId}-value`} className="pl-6">
                  {conflict.theirs || t("translations.emptyValue")}
                </div>
              </div>
            </fieldset>
          )
        })}
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={isLoading}
          onClick={() => onResolve(choices)}
          id="resolveTranslationConflicts"
        >
          {t("translations.conflictApply")}
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={isLoading} onClick={onClose}>
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
