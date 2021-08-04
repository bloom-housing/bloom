import React, { useContext } from "react"
import {
  AuthContext,
} from "@bloom-housing/ui-components"
import { UserRole } from "@bloom-housing/backend-core/types"

type AuthGuardProps = {
  listingId?: string;
  children: React.ReactElement;
}

const ListingGuard = ({ listingId, children }: AuthGuardProps) => {
  const { profile } = useContext(AuthContext)

  const leasingAgentInListingsIds = profile.leasingAgentInListings.map(item => item.id)
  const hasPrivileges = profile.roles.includes(UserRole.admin) || leasingAgentInListingsIds.includes(listingId)

  if (hasPrivileges) {
    return children
  }

  return null
}

export { ListingGuard as default, ListingGuard }