import { createContext, useContext } from "react"
import { FeatureFlag } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

// Null on a page with no data function, where the bundled content stands (#6594).
export const JurisdictionFeatureFlagsContext = createContext<FeatureFlag[] | null>(null)

export const useJurisdictionFeatureFlags = () => useContext(JurisdictionFeatureFlagsContext)
