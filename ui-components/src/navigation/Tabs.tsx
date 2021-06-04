import React, { FunctionComponent } from "react"
import "./Tabs.scss"

import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from "react-tabs"

export interface TabsProps {
  children: React.ReactNode
  className?: string
  defaultFocus?: boolean
  defaultIndex?: number
  disabledTabClassName?: string
  domRef?: (node?: HTMLElement) => void
  forceRenderTabPanel?: boolean
  onSelect?: (index: number, last: number, event: Event) => boolean | void
  selectedIndex?: number
  selectedTabClassName?: string
  selectedTabPanelClassName?: string
}

export const Tabs: FunctionComponent<TabsProps> = ({ children, ...props }: TabsProps) => {
  const className = ["tabs"]
  if (props.className) className.push(props.className)
  return (
    <ReactTabs {...props} className={className.join(" ")}>
      {children}
    </ReactTabs>
  )
}

export interface TabProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  disabledClassName?: string
  selectedClassName?: string
  tabIndex?: string
}

export const Tab: FunctionComponent<TabProps> = ({ children, ...props }: TabProps) => {
  const className = ["tabs__tab"]
  if (props.className) className.push(props.className)
  return (
    <ReactTab selectedClassName="is-active" {...props} className={className}>
      {children}
    </ReactTab>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Tab.tabsRole = "Tab"

export interface TabListProps {
  children: React.ReactNode
  className?: string | string[] | { [name: string]: boolean }
}

export const TabList: FunctionComponent<TabListProps> = ({ children, ...props }: TabListProps) => {
  return <ReactTabList {...props}>{children}</ReactTabList>
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TabList.tabsRole = "TabList"

export interface TabPanelProps {
  children: React.ReactNode
  className?: string
  forceRender?: boolean
  selectedClassName?: string
}

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  ...props
}: TabPanelProps) => {
  const className = ["tabs__panel"]
  if (props.className) className.push(props.className)
  return (
    <ReactTabPanel selectedClassName="is-active" {...props} className={className}>
      {children}
    </ReactTabPanel>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
TabPanel.tabsRole = "TabPanel"
