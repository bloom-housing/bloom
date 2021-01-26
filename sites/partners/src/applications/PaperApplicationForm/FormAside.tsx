import React, { useMemo } from "react"
import {
  t,
  StatusAside,
  StatusMessages,
  GridCell,
  Button,
  LinkButton,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"

type FormAsideProps = {
  isEdit: boolean
  triggerSubmitAndRedirect: () => void
  listingId: string
  lastUpdated?: string
}

const FormAside = ({
  listingId,
  isEdit,
  triggerSubmitAndRedirect,
  lastUpdated,
}: FormAsideProps) => {
  const actions = useMemo(() => {
    const elements = []

    elements.push(
      <GridCell key="btn-submit">
        <Button styleType={AppearanceStyleType.primary} fullWidth onClick={() => false}>
          {isEdit ? t("application.add.saveAndExit") : t("t.submit")}
        </Button>
      </GridCell>
    )

    if (!isEdit) {
      elements.push(
        <GridCell key="btn-submitNew">
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            fullWidth
            onClick={() => triggerSubmitAndRedirect()}
          >
            {t("t.submitNew")}
          </Button>
        </GridCell>
      )
    }

    elements.push(
      <GridCell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0"
          href={`/listings/${listingId}/applications`}
        >
          {t("t.cancel")}
        </LinkButton>
      </GridCell>
    )

    return elements
  }, [isEdit, listingId, triggerSubmitAndRedirect])

  return (
    <StatusAside columns={1} actions={actions}>
      {isEdit && <StatusMessages lastTimestamp={lastUpdated} />}
    </StatusAside>
  )
}

export { FormAside as default, FormAside }
