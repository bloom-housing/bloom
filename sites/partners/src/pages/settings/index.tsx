import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const Settings = () => {
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const router = useRouter()
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const enableAgencies = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )

  useEffect(() => {
    if (!enableProperties && !atLeastOneJurisdictionEnablesPreferences && !enableAgencies) {
      void router.replace("/")
      return
    }

    if (atLeastOneJurisdictionEnablesPreferences) {
      void router.replace("/settings/preferences")
      return
    }

    if (enableProperties) {
      void router.replace("/settings/properties")
      return
    }

    if (enableAgencies) {
      void router.replace("/settings/agencies")
    }
  }, [router, atLeastOneJurisdictionEnablesPreferences, enableProperties, enableAgencies])
}

export default Settings
