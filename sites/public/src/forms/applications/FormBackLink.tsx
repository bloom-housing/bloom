import { Button, LinkButton, OnClientSide, t } from "@bloom-housing/ui-components"

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
