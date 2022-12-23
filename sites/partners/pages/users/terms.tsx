import React, { useContext, useCallback, useMemo } from "react"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "@bloom-housing/ui-components"
import { AuthContext } from "../../shared"

const TermsPage = () => {
  const { profile, userProfileService, loadProfile } = useContext(AuthContext)

  const onSubmit = useCallback(async () => {
    if (!profile) return

    const jurisdictionIds =
      profile?.jurisdictions.map((item) => ({
        id: item.id,
      })) || []

    await userProfileService?.update({
      body: { ...profile, jurisdictions: jurisdictionIds, agreedToTermsOfService: true },
    })

    loadProfile?.("/")
  }, [loadProfile, profile, userProfileService])

  const jurisdictionTerms = useMemo(() => {
    const jurisdiction = profile?.jurisdictions.find((jurisdiction) => jurisdiction.partnerTerms)
    return jurisdiction ? jurisdiction.partnerTerms : ""
  }, [profile])

  return (
    <FormsLayout>
      <FormTerms onSubmit={onSubmit} terms={jurisdictionTerms} />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
