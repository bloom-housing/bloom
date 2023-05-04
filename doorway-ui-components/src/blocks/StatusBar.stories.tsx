import React from "react"
import { Button } from "../actions/Button"
import { StatusBar } from "./StatusBar"
import { AppearanceStyleType } from "../global/AppearanceTypes"

export default {
  title: "Blocks/Status Bar",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

export const StatusBarSuccessAndBackButton = () => (
  <StatusBar
    backButton={
      <Button inlineIcon="left" icon="arrowBack" onClick={handleClick}>
        Back
      </Button>
    }
    tagLabel="Submitted"
    tagStyle={AppearanceStyleType.success}
  />
)

export const StatusBarDraft = () => (
  <StatusBar tagLabel="Draft" tagStyle={AppearanceStyleType.primary} />
)
