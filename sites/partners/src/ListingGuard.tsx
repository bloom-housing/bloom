import React, { useContext } from "react"
import { useRouter } from "next/router"
import {
  AuthContext,
} from "@bloom-housing/ui-components"
import { UserRole } from "@bloom-housing/backend-core/types"

type AuthGuardProps = {
  children: React.ReactElement;
}

const ListingGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter()
  const listingId = router.query.id as string

  const { profile } = useContext(AuthContext)

  const leasingAgentInListingsIds = profile.leasingAgentInListings.map(item => item.id)
  const hasPrivileges = profile.roles.includes(UserRole.admin) || leasingAgentInListingsIds.includes(listingId)

  if (hasPrivileges) {
    return children
  }

  return null
}

export { ListingGuard as default, ListingGuard }