import * as React from "react"

import { withKnobs, text, select } from "@storybook/addon-knobs"
import { Button } from "../actions/Button"
import {
  AppearanceBorderType,
  AppearanceSizeType,
  AppearanceStyleType,
} from "../global/AppearanceTypes"

export default {
  title: "Actions/Button",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>, withKnobs],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

const StyleTypeStory = { ...AppearanceStyleType, default: undefined }
const BorderTypeStory = { ...AppearanceBorderType, default: undefined }

export const standard = () => {
  const styleSelect = select("Appearance Style", StyleTypeStory, undefined)
  const borderSelect = select("Appearance Border", BorderTypeStory, undefined)
  const iconSelect = select(
    "Icon",
    { arrowBack: "arrowBack", arrowForward: "arrowForward", default: undefined },
    undefined
  )
  const iconPlacementSelect = select(
    "Icon Placement",
    { left: "left", right: "right", default: undefined },
    undefined
  )

  return (
    <>
      <Button
        styleType={styleSelect}
        border={borderSelect}
        icon={iconSelect}
        iconPlacement={iconPlacementSelect}
        onClick={handleClick}
      >
        {text("Label", "Hello Storybook")}
      </Button>

      <p className="mt-10">Try out different styles with the Knobs below.</p>
    </>
  )
}

export const small = () => (
  <Button size={AppearanceSizeType.small} onClick={handleClick}>
    Small Button
  </Button>
)

export const big = () => (
  <Button size={AppearanceSizeType.big} onClick={handleClick}>
    Big Button
  </Button>
)

export const SmallAndPrimary = () => (
  <Button
    size={AppearanceSizeType.small}
    styleType={AppearanceStyleType.primary}
    onClick={handleClick}
  >
    Small and Primary Button
  </Button>
)

export const NormalCase = () => (
  <Button normalCase={true} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

export const NormalCaseAndSuccess = () => (
  <Button normalCase={true} styleType={AppearanceStyleType.success} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

export const borderless = () => (
  <Button border={AppearanceBorderType.borderless} onClick={handleClick}>
    Borderless Button
  </Button>
)

export const unstyled = () => (
  <Button unstyled={true} onClick={handleClick}>
    Unstyled Button
  </Button>
)

export const inlineIcon = () => (
  <>
    <Button inlineIcon="left" icon="arrowBack" onClick={() => alert("Click!")}>
      Go Back
    </Button>
    <br />
    <br />
    <Button inlineIcon="right" icon="right" onClick={() => alert("Click!")}>
      Go Forward
    </Button>
    <br />
    <br />
    <Button inlineIcon="right" icon="arrowForward" onClick={() => alert("Click!")}>
      Go Forward
    </Button>
  </>
)

export const loading = () => (
  <Button styleType={AppearanceStyleType.primary} loading={true} onClick={handleClick}>
    Loading Button
  </Button>
)

// TODO: replace with tailwind markup, if it matters
export const inaccessible = () => (
  <button style={{ backgroundColor: "red", color: "darkRed" }}>Inaccessible button</button>
)
