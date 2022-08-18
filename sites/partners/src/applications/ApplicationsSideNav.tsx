import React from "react"
import { useRouter } from "next/router"
import { t, SideNav } from "@bloom-housing/ui-components"
import { useFlaggedApplicationsMeta } from "../../lib/hooks"

type ApplicationsSideNavProps = {
  className?: string
  listingId: string
}

const ApplicationsSideNav = ({ className, listingId }: ApplicationsSideNavProps) => {
  const router = useRouter()
  const { data } = useFlaggedApplicationsMeta(listingId)
  const items = [
    {
      label: t("applications.allApplications"),
      url: `/listings/${listingId}/applications`,
      count: data?.totalCount || 0,
    },
    {
      label: t("applications.pendingReview"),
      url: `/listings/${listingId}/applications/pending`,
      count: data?.totalPendingCount || 0,
      /* childrenItems: [
        {
          label: t("applications.namedob"),
          url: `/listings/${listingId}/applications/pending?type=name_dob`,
          count: data?.totalNamePendingCount || 0,
        },
        {
          label: t("t.email"),
          url: `/listings/${listingId}/applications/pending?type=email`,
          count: data?.totalEmailPendingCount || 0,
        },
      ], */
    },
    {
      label: t("t.resolved"),
      url: `/listings/${listingId}/applications/resolved`,
      count: data?.totalResolvedCount || 0,
    },
  ].reduce((acc, curr) => {
    // check which element is currently active

    if (curr.url === router.asPath) {
      Object.assign(curr, { current: true })
    }

    if (curr.childrenItems) {
      curr.childrenItems.forEach((childItem) => {
        if (childItem.url === router.asPath) {
          Object.assign(childItem, { current: true })
        }
      })
    }

    acc.push(curr)

    return acc
  }, [])

  return <SideNav className={className} navItems={items} />
}

export { ApplicationsSideNav as default, ApplicationsSideNav }
