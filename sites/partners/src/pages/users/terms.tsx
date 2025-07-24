import React, { useContext, useCallback, useMemo } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "../../components/users/FormTerms"

const TermsPage = () => {
  const { profile, userService, loadProfile } = useContext(AuthContext)

  const onSubmit = useCallback(async () => {
    if (!profile) return

    await userService?.update({
      body: { ...profile, agreedToTermsOfService: true },
    })

    loadProfile?.("/")
  }, [loadProfile, profile, userService])

  const jurisdictionTerms = useMemo(() => {
    const jurisdiction = profile?.jurisdictions.find((jurisdiction) => jurisdiction.partnerTerms)
    return jurisdiction ? jurisdiction.partnerTerms : ""
  }, [profile])

  return (
    <FormsLayout title={`Accept Terms - ${t("nav.siteTitlePartners")}`}>
      <FormTerms onSubmit={onSubmit} terms={jurisdictionTerms} />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
