import React from "react"
import { useRouter } from "next/router"
import { t, SideNav } from "@bloom-housing/ui-components"

type ApplicationsSideNavProps = {
  className?: string
  listingId: string
}

const ApplicationsSideNav = ({ className, listingId }: ApplicationsSideNavProps) => {
  const router = useRouter()

  const items = [
    {
      label: t("applications.allApplications"),
      url: `/listings/${listingId}/applications`,
      count: 0,
    },
    {
      label: t("applications.pendingReview"),
      url: `/listings/${listingId}/applications/pending`,
      count: 0,
      childrenItems: [
        {
          label: t("applications.namedob"),
          url: `/listings/${listingId}/applications/pending?type=name_dob`,
          count: 0
        },
        {
          label: t("t.email"),
          url: `/listings/${listingId}/applications/pending?type=email`,
          count: 0
        },
      ]
    },
    { label: t("t.resolved"), url: `/listings/${listingId}/applications/resolved`, count: 0 },
  ].reduce((acc, curr) => {
    // check which element is currently active

    if (curr.url === router.asPath) {
      Object.assign(curr, { current: true })
    }

    if (curr.childrenItems) {
      curr.childrenItems.forEach(childItem => {
        if (childItem.url === router.asPath) {
          Object.assign(childItem, { current: true })
        }
      })
    }

    acc.push(curr)

    return acc
  }, [])

  return (
    <SideNav
      className={className}
      navItems={items}
    />
  )
}

export { ApplicationsSideNav as default, ApplicationsSideNav }
