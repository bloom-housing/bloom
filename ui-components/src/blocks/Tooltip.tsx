import React, { useState } from "react"
import "./Tooltip.scss"

export interface TooltipProps {
  className?: string
  id: string
  text: string
}

const Tooltip: React.FC<TooltipProps> = ({ className, id, text, children }) => {
  const [isHidden, setHidden] = useState(true)

  const show = () => setHidden(false)
  const hide = () => setHidden(true)

  return (
    <div className={`tooltip ${className || ""}`}>
      <div className="tooltip__element" role="tooltip" id={id} hidden={isHidden}>
        {text}
      </div>

      <div onFocus={show} onMouseEnter={show} onBlur={hide} onMouseLeave={hide}>
        {children}
      </div>
    </div>
  )
}

export { Tooltip as default, Tooltip }
