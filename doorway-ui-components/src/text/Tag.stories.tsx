import * as React from "react"
import {
  AppearanceSizeType,
  AppearanceShadeType,
} from "../global/AppearanceTypes"
import { BADGES } from "../../.storybook/constants"
import { Tag } from "./Tag"
import TagDocumentation from "./Tag.docs.mdx"
import { AppearanceStyleType } from "@bloom-housing/ui-components"

export default {
  title: "Text/Tag 🚩",
  id: "text/tag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: TagDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const standard = () => <Tag>Tag</Tag>

export const success = () => <Tag styleType={AppearanceStyleType.success}>Success</Tag>

export const warning = () => <Tag styleType={AppearanceStyleType.warning}>Warning</Tag>

export const small = () => <Tag size={AppearanceSizeType.small}>Warning</Tag>

// TODO: export const big = () => <Tag size={AppearanceSizeType.big}>Warning</Tag>

export const pill = () => <Tag pillStyle={true}>Pill Style</Tag>

export const pillSmall = () => (
  <Tag pillStyle={true} size={AppearanceSizeType.small}>
    Pill Small
  </Tag>
)

export const pillLarge = () => (
  <Tag pillStyle={true} styleType={AppearanceStyleType.success}>
    Pill Large
  </Tag>
)

const Spacer = () => {
  return <div style={{ height: "10px" }} />
}
export const pillColors = () => (
  <>
    <Tag pillStyle={true} styleType={AppearanceStyleType.primary}>
      Primary
    </Tag>
    <Spacer />
    <Tag pillStyle={true} styleType={AppearanceStyleType.secondary}>
      Secondary
    </Tag>
    <Spacer />
    <Tag pillStyle={true} styleType={AppearanceStyleType.success}>
      Success Dark
    </Tag>
    <Spacer />
    <Tag pillStyle={true} styleType={AppearanceStyleType.success} shade={AppearanceShadeType.light}>
      Success Light
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.accentCool}
      shade={AppearanceShadeType.dark}
    >
      Accent Cool Dark
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.accentCool}
      shade={AppearanceShadeType.light}
    >
      Accent Cool Light
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.accentWarm}
      shade={AppearanceShadeType.dark}
    >
      Accent Warm Dark
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.accentWarm}
      shade={AppearanceShadeType.light}
    >
      Accent Warm Light
    </Tag>
    <Spacer />
    <Tag pillStyle={true} styleType={AppearanceStyleType.closed}>
      Closed
    </Tag>
  </>
)

export const pillListings = () => (
  <div style={{ width: "200px" }}>
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.primary}
      size={AppearanceSizeType.small}
      fillContainer={true}
    >
      Draft
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.success}
      shade={AppearanceShadeType.light}
      size={AppearanceSizeType.small}
      fillContainer={true}
    >
      Scheduled
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.closed}
      size={AppearanceSizeType.small}
      fillContainer={true}
    >
      Closed
    </Tag>
    <Spacer />
    <Tag
      pillStyle={true}
      styleType={AppearanceStyleType.accentCool}
      shade={AppearanceShadeType.dark}
      size={AppearanceSizeType.small}
      fillContainer={true}
    >
      Results
    </Tag>
  </div>
)
