import { Button, LinkButton, t } from "@bloom-housing/ui-components"
import { OnClientSide } from "../../../shared"

const FormBackLink = (props: { url: string; onClick: () => void; custom?: boolean }) => {
  return (
    <p className="form-card__back">
      {props.custom ? (
        <Button inlineIcon="left" icon="arrowBack" onClick={props.onClick}>
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
