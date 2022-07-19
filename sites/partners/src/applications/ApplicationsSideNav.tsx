import React from "react"
import { useRouter } from "next/router"
import {
  t,
  SideNav,
} from "@bloom-housing/ui-components"


type ApplicationsSideNavProps = {
  className?: string;
  listingId: string;
}

const ApplicationsSideNav = ({ className, listingId }: ApplicationsSideNavProps) => {
  const router = useRouter()

  return (
    <SideNav
      className={className}
      navItems={[
        {
          label: t("applications.allApplications"),
          url: `/listings/${listingId}/applications`,
          current: true,
        },
        {
          label: t("applications.pendingReview"),
          url: `/listings/${listingId}/applications/pending`,
        },
        { label: t("t.resolved"), url: `/listings/${listingId}/applications/resolved` },
      ]}
    />
  )
}

export { ApplicationsSideNav as default, ApplicationsSideNav }