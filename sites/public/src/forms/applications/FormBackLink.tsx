import { LinkButton, OnClientSide, t } from "@bloom-housing/ui-components"

const FormBackLink = (props: { url: string }) => (
  <p className="form-card__back">
    {OnClientSide() && props.url && (
      <LinkButton inlineIcon="left" icon="arrowBack" href={props.url}>
        {t("t.back")}
      </LinkButton>
    )}
  </p>
)

export default FormBackLink
