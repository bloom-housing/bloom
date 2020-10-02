import * as React from "react"
import Icon from "../atoms/Icon"
import "./Drawer.scss"

export interface DrawerProps {
  title?: string
  subtitle?: string
  className?: string
  ariaDescription?: string
  children: React.ReactNode
  hasBackdrop?: boolean
}

const Drawer = (props: DrawerProps) => {
  const drawerClasses = ["drawer"]
  if (props.className) drawerClasses.push(props.className)

  const drawerWrapperClasses = ["drawer__wrapper"]
  if (props.hasBackdrop) drawerWrapperClasses.push("has-backdrop")

  return (
    <div
      className={drawerWrapperClasses.join(" ")}
      role="dialog"
      aria-labelledby={props.title}
      aria-describedby={props.ariaDescription}
    >
      <div className={drawerClasses.join(" ")}>
        <header className="drawer__header">
          {props.title && <h1 className="drawer__title">{props.title}</h1>}
          <button className="drawer__close" aria-label="Close" tabIndex={0}>
            <Icon size="medium" symbol="close" />
          </button>
        </header>

        <div className="drawer__body">
          <div className="drawer__content">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export { Drawer as default, Drawer }
