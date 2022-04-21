import React from "react"
import { Tooltip } from './Tooltip'

export default {
  title: "Blocks/Tooltip",
}

export const TooltipStory = () => (
  <div style={{ marginTop: '100px', marginLeft: '100px', width: '200px', backgroundColor: '#fafafa' }}>
    <Tooltip id="test-tooltip" text="Lorem ipsum dolor sit amet.">
      <div>
        <button>test 1</button>
        <button>test 2</button>
      </div>
    </Tooltip>
  </div>

)
