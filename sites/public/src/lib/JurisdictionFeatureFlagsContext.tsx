import { createContext, useContext } from "react"
import { FeatureFlag } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const JurisdictionFeatureFlagsContext = createContext<FeatureFlag[] | null>(null)

export const useJurisdictionFeatureFlags = () => useContext(JurisdictionFeatureFlagsContext)
