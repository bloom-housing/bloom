import React, { useContext, useCallback, useMemo } from "react"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "../../components/users/FormTerms"
import { AuthContext } from "@bloom-housing/shared-helpers"

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
    <FormsLayout>
      <FormTerms onSubmit={onSubmit} terms={jurisdictionTerms} />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
