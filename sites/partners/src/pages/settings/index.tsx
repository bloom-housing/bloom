import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const Settings = () => {
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const router = useRouter()
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )

  useEffect(() => {
    if (!enableProperties && !atLeastOneJurisdictionEnablesPreferences) void router.replace("/")
    void router.replace(
      atLeastOneJurisdictionEnablesPreferences ? "/settings/preferences" : "/settings/properties"
    )
  }, [router, atLeastOneJurisdictionEnablesPreferences, enableProperties])
}

export default Settings
