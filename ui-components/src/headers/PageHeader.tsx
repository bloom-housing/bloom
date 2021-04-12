import * as React from "react"
import { useRouter } from "next/router"
import "./PageHeader.scss"
import { Tab, TabNav } from "../navigation/TabNav"

type TabNavItem = {
  label: string
  path: string
  content?: React.ReactNode
}
export interface PageHeaderProps {
  className?: string
  inverse?: boolean
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
  tabNav?: TabNavItem[]
}

const PageHeader = (props: PageHeaderProps) => {
  const router = useRouter()
  const currentPath = router?.asPath

  const classNames = ["page-header"]
  if (props.className) {
    classNames.push(...props.className.split(" "))
  }

  if (props.inverse) {
    classNames.push("bg-primary-dark")
    classNames.push("text-white")
  } else {
    classNames.push("bg-primary-lighter")
  }

  return (
    <header className={classNames.join(" ")}>
      <hgroup className="page-header__group">
        <h1 className="page-header__title">{props.title}</h1>
        {props.subtitle && <p className="page-header__lead"> {props.subtitle}</p>}
        {props.children}

        {props?.tabNav && (
          <TabNav className="page-header__secondary-nav">
            {props.tabNav?.map((tab) => (
              <Tab
                key={tab.path}
                tagContent={tab?.content}
                current={tab.path === currentPath}
                href={tab.path}
              >
                {tab.label}
              </Tab>
            ))}
          </TabNav>
        )}
      </hgroup>
    </header>
  )
}

export { PageHeader as default, PageHeader }
