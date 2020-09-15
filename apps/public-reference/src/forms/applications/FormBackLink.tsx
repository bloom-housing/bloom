import Link from "next/link"
import { t } from "@bloom-housing/ui-components"
import ApplicationConductor from "../../../lib/ApplicationConductor"

const FormBackLink = (props: { conductor: ApplicationConductor }) => (
  <p className="form-card__back">
    {props.conductor.config.steps.length > 1 && (
      <strong>
        <Link href={props.conductor.determinePreviousUrl()}>
          <a>{t("t.back")}</a>
        </Link>
      </strong>
    )}
  </p>
)

export default FormBackLink
