import React from "react"
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
}

const FormAside = ({ listingId, isEdit, triggerSubmitAndRedirect }: FormAsideProps) => {
  return (
    <StatusAside
      columns={1}
      actions={[
        <GridCell key="btn-submit">
          <Button styleType={AppearanceStyleType.primary} fullWidth onClick={() => false}>
            {t("t.submit")}
          </Button>
        </GridCell>,
        <GridCell key="btn-submitNew">
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            fullWidth
            onClick={() => triggerSubmitAndRedirect()}
          >
            {t("t.submitNew")}
          </Button>
        </GridCell>,
        <GridCell className="flex" key="btn-cancel">
          <LinkButton
            unstyled
            fullWidth
            className="bg-opacity-0"
            href={`/listings/${listingId}/applications`}
          >
            {t("t.cancel")}
          </LinkButton>
        </GridCell>,
      ]}
    >
      {isEdit && <StatusMessages lastTimestamp="" />}
    </StatusAside>
  )
}

export { FormAside as default, FormAside }
