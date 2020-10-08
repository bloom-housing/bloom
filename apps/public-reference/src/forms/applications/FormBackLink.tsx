import Link from "next/link"
import { OnClientSide, t } from "@bloom-housing/ui-components"

const FormBackLink = (props: { url: string }) => (
  <p className="form-card__back">
    {OnClientSide() && props.url && (
      <strong>
        <Link href={props.url}>
          <a>{t("t.back")}</a>
        </Link>
      </strong>
    )}
  </p>
)

export default FormBackLink
