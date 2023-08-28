import React from "react"

const CellLabel = ({ children }) => {
  return (
    <p
      className="spacer-label"
      style={{
        fontSize: "var(--seeds-type-label-size)",
        color: "var(--seeds-input-text-label-color)",
      }}
    >
      {children}
    </p>
  )
}

export default CellLabel
