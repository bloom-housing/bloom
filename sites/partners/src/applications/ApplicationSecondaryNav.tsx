import React, { useMemo } from "react"
import { PageHeader, t, TabNav, TabNavItem, AppearanceSizeType } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"

type ApplicationSecondaryNavProps = {
  title: string
  listingId: string
  showTabs?: boolean
  flagsQty?: number
  children?: React.ReactChild
  breadcrumbs?: React.ReactNode
}

const ApplicationSecondaryNav = ({
  title,
  listingId,
  showTabs,
  flagsQty,
  children,
  breadcrumbs,
}: ApplicationSecondaryNavProps) => {
  const router = useRouter()
  const currentPath = router?.asPath

  const tabNavElements = useMemo(() => {
    const elements = [
      {
        label: t("t.listingSingle"),
        path: `/listings/${listingId}`,
        content: undefined,
      },
      {
        label: t("nav.applications"),
        path: `/listings/${listingId}/applications`,
        content: undefined,
      },
    ]

    if (process.env.showDuplicates && typeof flagsQty === "number") {
      elements.push({
        label: t("nav.flags"),
        path: `/listings/${listingId}/flags`,
        content: <>{flagsQty}</>,
      })
    }

    return elements
  }, [flagsQty, listingId])

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
    <PageHeader title={title} tabNav={showTabs ? tabs : null} breadcrumbs={breadcrumbs}>
      {children}
    </PageHeader>
  )
}

export { ApplicationSecondaryNav as default, ApplicationSecondaryNav }
