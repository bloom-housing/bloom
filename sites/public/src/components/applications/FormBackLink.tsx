import { Icon, t } from "@bloom-housing/ui-components"
import { Button, Link } from "@bloom-housing/ui-seeds"
import { OnClientSide } from "@bloom-housing/shared-helpers"

const FormBackLink = (props: { url: string; onClick: () => void; custom?: boolean }) => {
  return (
    <p className="form-card__back">
      {props.custom ? (
        <Button
          leadIcon={<Icon symbol="arrowBack" size="small" />}
          variant="text"
          size="sm"
          className="font-semibold no-underline"
          onClick={props.onClick}
        >
          {t("t.back")}
        </Button>
      ) : (
        <>
          {OnClientSide() && props.url && (
            <Link
              leadIcon={<Icon symbol="arrowBack" size="small" />}
              className="font-semibold text-sm no-underline justify-center"
              href={props.url}
            >
              {t("t.back")}
            </Link>
          )}
        </>
      )}
    </p>
  )
}

export default FormBackLink
