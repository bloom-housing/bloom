import React from "react"
import { Button } from "../.."
import { Tooltip } from './Tooltip'

export default {
  title: "Blocks/Tooltip",
}

export const TooltipStory = () => (
  <div style={{ marginTop: '100px', marginLeft: '100px' }}>
    <Tooltip id="test-tooltip" text="Lorem ipsum dolor sit amet.">
      <Button>Click me</Button>
    </Tooltip>
  </div>
)
