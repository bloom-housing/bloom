import React from "react"
import { StatusAside } from "./StatusAside"
import { GridCell } from "../sections/GridSection"
import { Button } from "../actions/Button"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import { StatusMessages, StatusMessage } from "./StatusMessage"
import { AppearanceStyleType } from "@bloom-housing/ui-components"

export default {
  title: "Notifications/Status Aside",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const WithButtonsAndMessages = () => (
  <StatusAside
    actions={[
      <GridCell key={0}>
        <Button fullWidth={true} size={AppearanceSizeType.small}>
          Save
        </Button>
      </GridCell>,
      <GridCell key={1}>
        <Button
          styleType={AppearanceStyleType.secondary}
          fullWidth={true}
          size={AppearanceSizeType.small}
        >
          Preview
        </Button>
      </GridCell>,
      <GridCell span={2} key={2}>
        <Button
          styleType={AppearanceStyleType.primary}
          fullWidth={true}
          size={AppearanceSizeType.small}
        >
          Submit
        </Button>
      </GridCell>,
    ]}
  >
    <StatusMessages>
      <StatusMessage
        status="Submitted"
        style={AppearanceStyleType.success}
        timestamp="3/2/21"
        body="Changed status of one application."
      />
      <StatusMessage status="Draft" timestamp="2/1/21" />
    </StatusMessages>
  </StatusAside>
)

export const OnlyTimestamp = () => (
  <StatusAside
    columns={1}
    actions={[
      <GridCell key={0}>
        <Button fullWidth={true} size={AppearanceSizeType.small}>
          Save
        </Button>
      </GridCell>,
      <GridCell key={1}>
        <Button
          styleType={AppearanceStyleType.secondary}
          fullWidth={true}
          size={AppearanceSizeType.small}
        >
          Preview
        </Button>
      </GridCell>,
    ]}
  >
    <StatusMessages lastTimestamp="February 3, 2021" />
  </StatusAside>
)
