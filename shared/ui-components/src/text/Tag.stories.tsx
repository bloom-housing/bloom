import { AppearanceSizeType, AppearanceStyleType } from "../global/AppearanceTypes"
import * as React from "react"
import { Tag } from "./Tag"

export default {
  title: "Text/Tag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const standard = () => <Tag>Tag</Tag>

export const success = () => <Tag type={AppearanceStyleType.success}>Success</Tag>

export const warning = () => <Tag type={AppearanceStyleType.warning}>Warning</Tag>

export const small = () => <Tag size={AppearanceSizeType.small}>Warning</Tag>

// TODO: export const big = () => <Tag size={AppearanceSizeType.big}>Warning</Tag>

export const pill = () => <Tag pillStyle={true}>Pill Style</Tag>

export const pillSmall = () => (
  <Tag pillStyle={true} size={AppearanceSizeType.small}>
    Pill Small
  </Tag>
)

export const PillAndSuccess = () => (
  <Tag pillStyle={true} type={AppearanceStyleType.success}>
    Pill Success
  </Tag>
)
