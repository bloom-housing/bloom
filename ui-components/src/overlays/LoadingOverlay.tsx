import React, { useMemo } from "react"
import "./LoadingOverlay.scss"

type LoadingOverlayProps = {
  isLoading: boolean
  children: React.ReactChild
}

const LoadingOverlay = ({ isLoading, children }: LoadingOverlayProps) => {
  const content = useMemo(() => {
    if (!isLoading) return children

    return (
      <div className="loading-overlay">
        <span className="spinner"></span>

        {children}
      </div>
    )
  }, [isLoading, children])

  return (
    <div role="alert" aria-live="assertive">
      {content}
    </div>
  )
}

export { LoadingOverlay as default, LoadingOverlay }
