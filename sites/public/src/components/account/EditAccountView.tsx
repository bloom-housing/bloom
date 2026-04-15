import { AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { useContext } from "react"
import FormsLayout from "../../layouts/forms"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { EditAdvocateAccount } from "./EditAdvocateAccount"
import { EditPublicAccount } from "./EditPublicAccount"

type EditAccountViewProps = {
  agencies: Agency[]
}

export const EditAccountView = (props: EditAccountViewProps) => {
  const { profile } = useContext(AuthContext)

  return (
    <FormsLayout
      pageTitle={t("account.accountSettings")}
      metaDescription={t("pageDescription.accountSettings")}
    >
      {profile?.isAdvocate ? (
        <EditAdvocateAccount agencies={props.agencies} />
      ) : (
        <EditPublicAccount />
      )}
    </FormsLayout>
  )
}
