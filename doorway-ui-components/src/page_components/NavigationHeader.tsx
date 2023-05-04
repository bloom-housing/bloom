import React, { useMemo, useContext } from "react"
import { PageHeader, TabNav, TabNavItem, AppearanceSizeType } from "../.."
import { NavigationContext } from "../config/NavigationContext"
import "./NavigationHeader.scss"

type NavigationHeaderProps = {
  className?: string
  title: React.ReactNode
  listingId?: string
  tabs?: NavigationHeaderTabs
  breadcrumbs?: React.ReactNode
  children?: React.ReactNode
}

type NavigationHeaderTabs = {
  show?: boolean
  flagsQty?: number
  listingLabel: string
  applicationsLabel: string
}

type NavigationHeaderTabsElement = {
  label: string
  path: string
  activePaths: string[]
  content: React.ReactNode | undefined
}

const NavigationHeader = ({
  className,
  title,
  listingId,
  tabs,
  children,
  breadcrumbs,
}: NavigationHeaderProps) => {
  const navigation = useContext(NavigationContext)
  const currentPath = navigation.router.asPath

  const tabNavElements = useMemo(() => {
    const elements: NavigationHeaderTabsElement[] = [
      {
        label: tabs?.listingLabel || "",
        path: `/listings/${listingId}`,
        activePaths: [`/listings/${listingId}`],
        content: undefined,
      },
      {
        label: tabs?.applicationsLabel || "",
        path: `/listings/${listingId}/applications`,
        activePaths: [
          `/listings/${listingId}/applications`,
          `/listings/${listingId}/applications/pending`,
          `/listings/${listingId}/applications/pending?type=name_dob`,
          `/listings/${listingId}/applications/pending?type=email`,
          `/listings/${listingId}/applications/resolved`,
        ],
        content: undefined,
      },
    ]

    return elements
  }, [tabs, listingId])

  const tabNavItems = useMemo(() => {
    return (
      <TabNav className="relative -bottom-8 md:-bottom-10">
        {tabNavElements.map((tab) => (
          <TabNavItem
            key={tab.path}
            tagContent={tab?.content}
            current={tab.activePaths.includes(currentPath)}
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
      className={`navigation-header ${className ?? ""}`}
      title={title}
      tabNav={tabs?.show ? tabNavItems : null}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </PageHeader>
  )
}

export { NavigationHeader as default, NavigationHeader }
