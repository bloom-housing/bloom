import React, { useState } from "react"
import useKeyPress from "../helpers/useKeyPress"
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

  useKeyPress("Escape", () => hide())

  return (
    <div className={`tooltip ${className || ""}`}>
      <div className="tooltip__element" role="tooltip" id={id} hidden={isHidden}>
        {text}
      </div>

      <div
        className="tooltip__children"
        onFocus={show}
        onMouseEnter={show}
        onBlur={hide}
        onMouseLeave={hide}
      >
        {children}
      </div>
    </div>
  )
}

export { Tooltip as default, Tooltip }
