import React from "react"
import "./LoadingOverlay.scss"

type LoadingOverlayProps = {
  isLoading: boolean
  children: React.ReactChild
}

const LoadingOverlay = ({ isLoading, children }: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>

  return <div className="loading-overlay">{children}</div>
}

export { LoadingOverlay as default, LoadingOverlay }
