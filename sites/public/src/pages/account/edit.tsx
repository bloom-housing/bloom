import React, { useContext } from "react"
import { AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import { EditPublicAccount } from "../../components/account/EditPublicAccount"
import { EditAdvocateAccount } from "../../components/account/EditAdvocateAccount"
import { fetchAgencies, fetchJurisdictionByName } from "../../lib/hooks"
import {
  Agency,
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../lib/helpers"
import { t } from "@bloom-housing/ui-components"
import { EditAccountView } from "../../components/account/EditAccountView"

interface EditProps {
  agencies: Agency[]
  jursidiction: Jurisdiction
}

const Edit = (props: EditProps) => {
  const enableNotificationSettings = isFeatureFlagOn(
    props.jursidiction,
    FeatureFlagEnum.enableCustomListingNotifications
  )

  // TODO: Replace undefined with <TabView> with notification settings integrated.
  const pageContent = enableNotificationSettings ? undefined : (
    <EditAccountView agencies={props.agencies} />
  )

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      {pageContent}
    </RequireLogin>
  )
}

export default Edit

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)
  const agencies = await fetchAgencies(context.req, jurisdiction?.id)

  return {
    props: { jurisdiction, agencies: agencies?.items || [] },
  }
}
