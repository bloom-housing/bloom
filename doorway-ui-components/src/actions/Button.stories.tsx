import * as React from "react"
import { withKnobs, text, select } from "@storybook/addon-knobs"
import { BADGES } from "../../.storybook/constants"
import { Button } from "./Button"
import {
  AppearanceSizeType,
} from "../global/AppearanceTypes"
import ButtonDocumentation from "./Button.docs.mdx"
import { faArrowsRotate, faCoffee, faTable } from "@fortawesome/free-solid-svg-icons"
import { AppearanceBorderType, AppearanceStyleType } from "@bloom-housing/ui-components"

export default {
  title: "Actions/Button 🚩",
  id: "actions-button",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>, withKnobs],
  parameters: {
    docs: {
      page: ButtonDocumentation,
    },
    badges: [BADGES.GEN2],
  },
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

export const withFontAwesomeIcon = () => {
  const iconSelect = select("Icon", ["coffee", "rotate", "table"], "rotate")

  const iconsMap = {
    coffee: faCoffee,
    rotate: faArrowsRotate,
    table: faTable,
  }

  return (
    <>
      <Button
        icon={iconSelect ? iconsMap[iconSelect] : undefined}
        iconSize="medium"
        iconPlacement="left"
        onClick={handleClick}
      >
        FontAwesome is awesome
      </Button>

      <p className="mt-10">Try out different icons with the Knobs below.</p>
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

export const SmallAndSecondary = () => (
  <Button
    size={AppearanceSizeType.small}
    styleType={AppearanceStyleType.secondary}
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

export const disabled = () => (
  <Button onClick={handleClick} disabled={true}>
    Button (Disabled)
  </Button>
)

export const detroitStyle = () => {
  const cssVarsOverride = `
    .button-overrides {
      --bloom-font-sans: Montserrat;
      --bloom-font-alt-sans: var(--bloom-font-sans);
      --bloom-color-primary: rgb(41,126,115);
      --bloom-color-primary-dark: rgb(0,68,69);

      --primary-appearance-hover-background-color: white;
      --primary-appearance-hover-label-color: var(--bloom-color-primary-dark);

      --outlined-appearance-hover-background-color: var(--bloom-color-primary);
      --outlined-appearance-hover-border-color: var(--bloom-color-primary);
    }

    .button-overrides .button {
      --normal-rounded: 60px;
      --normal-padding: 0.5rem 1rem;
      --normal-font-size: var(--bloom-font-size-base);
      --label-letter-spacing: normal;
      --label-transform: none;
    }
  `

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      ></link>
      <div className="button-overrides">
        <Button styleType={AppearanceStyleType.primary} onClick={handleClick}>
          "Detroit" Primary Button
        </Button>{" "}
        <Button onClick={handleClick}>"Detroit" Outlined Button</Button>
        <style>{cssVarsOverride}</style>
      </div>

      <p className="mt-12 font-semibold">Customized using the following variable overrides:</p>

      <pre>
        {cssVarsOverride.replace(".button-overrides ", ":root ").replace(".button-overrides ", "")}
      </pre>
    </>
  )
}

export const loading = () => (
  <Button styleType={AppearanceStyleType.primary} loading={true} onClick={handleClick}>
    Loading Button
  </Button>
)

export const transitions = () => (
  <Button onClick={handleClick} transition={true}>
    With Transitions
  </Button>
)

// TODO: replace with tailwind markup, if it matters
export const inaccessible = () => (
  <button style={{ backgroundColor: "red", color: "darkRed" }}>Inaccessible button</button>
)

// Example of how you can override axe a11y checks
inaccessible.parameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "color-contrast",
          enabled: false,
        },
      ],
    },
  },
}
