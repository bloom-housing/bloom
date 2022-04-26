import React, { useMemo } from "react"
import { Icon } from "../icons/Icon"
import "./LoadingOverlay.scss"

type LoadingOverlayProps = {
  isLoading: boolean
  children: React.ReactChild
  classNames?: string
}

const LoadingOverlay = ({ isLoading, children, classNames }: LoadingOverlayProps) => {
  const content = useMemo(() => {
    if (!isLoading) return children

    let className = "loading-overlay"

    if (classNames) {
      className += ` ${classNames}`
    }

    return (
      <div className={className}>
        <Icon size="3xl" symbol="spinner" className="loading-overlay__spinner" />
        {children}
      </div>
    )
  }, [isLoading, children, classNames])

  return (
    <div role="alert" aria-live="assertive">
      {content}
    </div>
  )
}

export { LoadingOverlay as default, LoadingOverlay }
