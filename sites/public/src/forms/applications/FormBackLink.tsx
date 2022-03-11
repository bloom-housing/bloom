import React from "react"
import { Button, LinkButton, t } from "@bloom-housing/ui-components"
import { OnClientSide } from "@bloom-housing/shared-helpers"

const FormBackLink = (props: { url: string; onClick: () => void; custom?: boolean }) => {
  return (
    <p className="form-card__back" onClick={props.onClick}>
      {props.custom ? (
        <Button inlineIcon="left" icon="arrowBack">
          {t("t.back")}
        </Button>
      ) : (
        <>
          {OnClientSide() && props.url && (
            <LinkButton inlineIcon="left" icon="arrowBack" href={props.url}>
              {t("t.back")}
            </LinkButton>
          )}
        </>
      )}
    </p>
  )
}

export default FormBackLink
