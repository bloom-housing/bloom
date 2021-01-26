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

    const cancel = (
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

    if (isEdit) {
      elements.push(
        <div className="flex justify-center">
          {cancel}
          <GridCell className="flex" key="btn-delete">
            <Button
              type="button"
              unstyled
              fullWidth
              className="bg-opacity-0 text-red-700"
              onClick={() => console.log("delete")}
            >
              {t("t.delete")}
            </Button>
          </GridCell>
        </div>
      )
    } else {
      elements.push(cancel)
    }

    return elements
  }, [isEdit, listingId, triggerSubmitAndRedirect])

  return (
    <StatusAside columns={1} actions={actions}>
      {isEdit && <StatusMessages lastTimestamp={lastUpdated} />}
    </StatusAside>
  )
}

export { FormAside as default, FormAside }
