import FormsLayout from "../layouts/forms"
import { t } from "@bloom-housing/ui-components"
import { BloomCard } from "@bloom-housing/shared-helpers"
import { Card } from "@bloom-housing/ui-seeds"

export default () => {
  const pageTitle = t("errors.unauthorized.title")

  return (
    <FormsLayout title={`${pageTitle} - ${t("nav.siteTitlePartners")}`}>
      <BloomCard
        title={pageTitle}
        iconSymbol={"lockClosed"}
        iconClass="text-alert"
        headingClass={"seeds-large-heading"}
      >
        <Card.Section>
          <p>{t("errors.unauthorized.message")}</p>
        </Card.Section>
      </BloomCard>
    </FormsLayout>
  )
}
