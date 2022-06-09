import React, { useMemo, useContext } from "react"
import { PageHeader, TabNav, TabNavItem, AppearanceSizeType } from "@bloom-housing/ui-components"
import { NavigationContext } from "../config/NavigationContext"
import "./PartnersHeader.scss"

type PartnersHeaderProps = {
  className?: string
  title: React.ReactNode
  listingId?: string
  tabs?: PartnersHeaderTabs
  breadcrumbs?: React.ReactNode
  children?: React.ReactChild
}

type PartnersHeaderTabs = {
  show?: boolean
  flagsQty?: number
  listingLabel: string
  applicationsLabel: string
  flagsLabel: string
}

type PartnersHeaderTabsElement = {
  label: string
  path: string
  content: React.ReactNode | undefined
}

const PartnersHeader = ({
  className,
  title,
  listingId,
  tabs,
  children,
  breadcrumbs,
}: PartnersHeaderProps) => {
  const navigation = useContext(NavigationContext)
  const currentPath = navigation.router.asPath

  const tabNavElements = useMemo(() => {
    const elements: PartnersHeaderTabsElement[] = [
      {
        label: tabs?.listingLabel || "",
        path: `/listings/${listingId}`,
        content: undefined,
      },
      {
        label: tabs?.applicationsLabel || "",
        path: `/listings/${listingId}/applications`,
        content: undefined,
      },
    ]

    if (process.env.showDuplicates && typeof tabs?.flagsQty === "number") {
      elements.push({
        label: tabs.flagsLabel,
        path: `/listings/${listingId}/flags`,
        content: <>{tabs.flagsQty}</>,
      })
    }

    return elements
  }, [tabs, listingId])

  const tabNavItems = useMemo(() => {
    return (
      <TabNav className="relative -bottom-8 md:-bottom-10">
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
    <PageHeader
      className={`partners-header ${className ?? ""}`}
      title={title}
      tabNav={tabs?.show ? tabNavItems : null}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PageHeader>
  )
}

export { PartnersHeader as default, PartnersHeader }
