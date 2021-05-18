import { LinkButton, OnClientSide, Icon, t } from "@bloom-housing/ui-components"

const FormBackLink = (props: { url: string; onClick: () => void; static?: boolean }) => {
  return (
    <p className="form-card__back" onClick={props.onClick}>
      {props.static ? (
        <span tabIndex={0} onClick={props.onClick} className={"button is-inline inline-icon--left"}>
          <Icon symbol={"arrow-back"} size={"tiny"} className={"button__icon"} />
          {t("t.back")}
        </span>
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
