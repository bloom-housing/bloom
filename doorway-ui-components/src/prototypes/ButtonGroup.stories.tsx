import { AppearanceSizeType } from "../global/AppearanceTypes"
import React from "react"
import { Button } from "../actions/Button"

import "./ButtonGroup.scss"
import { AppearanceStyleType } from "@bloom-housing/ui-components"

export default {
  title: "Prototypes/ButtonGroup",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

export const ButtonGroup = () => (
  <div className="button-group grid grid-cols-2 gap-2">
    <div className="button-group__item">
      <Button size={AppearanceSizeType.small} onClick={handleClick}>
        Save
      </Button>
    </div>
    <div className="button-group__item">
      <Button size={AppearanceSizeType.small} className="is-secondary" onClick={handleClick}>
        Preview
      </Button>
    </div>
  </div>
)

export const ButtonGroupStack = () => (
  <div className="button-group grid grid-cols-2 gap-2">
    <div className="button-group__item">
      <Button size={AppearanceSizeType.small} onClick={handleClick}>
        Save
      </Button>
    </div>
    <div className="button-group__item">
      <Button size={AppearanceSizeType.small} className="is-secondary" onClick={handleClick}>
        Preview
      </Button>
    </div>
    <div className="button-group__item col-span-2">
      <Button
        size={AppearanceSizeType.small}
        styleType={AppearanceStyleType.primary}
        onClick={handleClick}
      >
        Submit
      </Button>
    </div>
  </div>
)
