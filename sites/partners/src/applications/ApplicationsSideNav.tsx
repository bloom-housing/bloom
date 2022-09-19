import React from "react"
import { useRouter } from "next/router"
import { t, SideNav, Tabs, TabList, Tab } from "@bloom-housing/ui-components"
import { useFlaggedApplicationsMeta } from "../../lib/hooks"
import LinkComponent from "../LinkComponent"

type ApplicationsSideNavProps = {
  className?: string
  listingId: string
  listingOpen?: boolean
}

const ApplicationsSideNav = ({
  className,
  listingId,
  listingOpen = false,
}: ApplicationsSideNavProps) => {
  const router = useRouter()
  const { data } = useFlaggedApplicationsMeta(listingId)
  const resolvedNav = listingOpen
    ? []
    : {
        label: t("t.resolved"),
        url: `/listings/${listingId}/applications/resolved`,
        count: data?.totalResolvedCount || 0,
      }

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
    },
  ]
    .concat(resolvedNav)
    .reduce((acc, curr) => {
      // check which element is currently active

      if (curr.url === router.asPath) {
        Object.assign(curr, { current: true })
      }

      acc.push(curr)

      return acc
    }, [])

  return (
    <>
      <div className={"hidden md:block"}>
        <SideNav className={className} navItems={items} />
      </div>
      <div className={"block md:hidden mb-4 w-full sm:w-auto"}>
        <SideNav className={`${className} side-nav__horizontal`} navItems={items} />
      </div>
    </>
  )
}

export { ApplicationsSideNav as default, ApplicationsSideNav }
