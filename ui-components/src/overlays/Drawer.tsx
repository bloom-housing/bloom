import * as React from "react"
import "./Drawer.scss"
import { Icon } from "../icons/Icon"
import { Overlay, OverlayProps } from "./Overlay"
import { Tag } from "../text/Tag"
import { AppearanceStyleType, AppearanceSizeType } from "../global/AppearanceTypes"
import { AlertTypes } from "../notifications/alertTypes"
import { AlertBox } from "../notifications"

export enum DrawerSide {
  left = "left",
  right = "right",
}

// Ensure each action has a unique key
export interface DrawerProps extends OverlayProps {
  title?: string
  headerTag?: string | React.ReactElement
  headerTagStyle?: AppearanceStyleType
  toastContent?: string
  toastStyle?: AlertTypes
  className?: string
  direction?: DrawerSide
  actions?: React.ReactNode[]
}

const Drawer = (props: DrawerProps) => {
  const drawerClasses = ["drawer"]
  if (props.className) drawerClasses.push(props.className)

  return (
    <Overlay
      ariaLabel={props.ariaLabel || props.title}
      ariaDescription={props.ariaDescription}
      open={props.open}
      onClose={props.onClose}
      backdrop={props.backdrop}
      className={"has-drawer" + (props.direction == DrawerSide.left ? " is-direction-left" : "")}
    >
      <div className={drawerClasses.join(" ")}>
        <header className="drawer__header">
          {props.title && <h1 className="drawer__title">{props.title}</h1>}
          {props.headerTag && (
            <Tag
              pillStyle={true}
              size={AppearanceSizeType.small}
              styleType={props.headerTagStyle}
              className={"ml-3"}
            >
              {props.headerTag}
            </Tag>
          )}
          {props.toastContent && (
            <AlertBox type={props.toastStyle} narrow={true} className={"ml-4"} closeable={true}>
              {props.toastContent}
            </AlertBox>
          )}
          <button onClick={props.onClose} className="drawer__close" aria-label="Close" tabIndex={0}>
            <Icon size="medium" symbol="close" />
          </button>
        </header>

        <div className="drawer__body">
          <div className="drawer__content">{props.children}</div>
        </div>

        {props.actions && <div className="p-4 flex gap-4">{props.actions}</div>}
      </div>
    </Overlay>
  )
}

export { Drawer as default, Drawer }
