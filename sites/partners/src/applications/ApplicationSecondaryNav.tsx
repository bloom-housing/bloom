import React, { useMemo } from "react"
import { PageHeader, t, TabNav, TabNavItem, AppearanceSizeType } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"

type ApplicationSecondaryNavProps = {
  title: string
  listingId: string
  flagsQty: number
  children?: React.ReactChild
}

const ApplicationSecondaryNav = ({
  title,
  listingId,
  flagsQty,
  children,
}: ApplicationSecondaryNavProps) => {
  const router = useRouter()
  const currentPath = router?.asPath

  const tabNavElements = useMemo(
    () => [
      {
        label: t("nav.applications"),
        path: `/listings/${listingId}/applications`,
      },
      {
        label: t("nav.flags"),
        path: `/listings/${listingId}/flags`,
        content: <>{flagsQty}</>,
      },
    ],
    [flagsQty, listingId]
  )

  const tabs = useMemo(() => {
    return (
      <TabNav className="relative -bottom-10">
        {tabNavElements.map((tab) => (
          <TabNavItem
            key={tab.path}
            tagContent={tab?.content}
            current={tab.path === currentPath}
            href={tab.path}
            tagSize={AppearanceSizeType.small}
          >
            {tab.label}
          </TabNavItem>
        ))}
      </TabNav>
    )
  }, [currentPath, tabNavElements])

  return (
    <PageHeader title={title} tabNav={process.env.showDuplicates ? tabs : null}>
      {children}
    </PageHeader>
  )
}

export { ApplicationSecondaryNav as default, ApplicationSecondaryNav }
