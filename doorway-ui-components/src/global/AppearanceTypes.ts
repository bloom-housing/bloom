export enum AppearanceStyleType {
  primary = "is-primary",
  secondary = "is-secondary",
  success = "is-success",
  alert = "is-alert",
  warning = "is-warning",
  info = "is-info",
  accentCool = "is-accent-cool",
  accentWarm = "is-accent-warm",
  closed = "is-closed",
}

export enum AppearanceSizeType {
  small = "is-small",
  normal = "is-normal",
  big = "is-big",
}

export enum AppearanceBorderType {
  borderless = "is-borderless",
  normal = "",
  outlined = "is-outlined",
}

export enum AppearanceShadeType {
  light = "is-light-mode",
  dark = "is-dark-mode",
}

export interface AppearanceProps {
  styleType?: AppearanceStyleType
  border?: AppearanceBorderType
  size?: AppearanceSizeType
  shade?: AppearanceShadeType
  normalCase?: boolean
}

export const classNamesForAppearanceTypes = (props: AppearanceProps) => {
  const classNames = []
  if (props.styleType) classNames.push(props.styleType)
  if (props.border) classNames.push(props.border)
  if (props.size) classNames.push(props.size)
  if (props.shade) classNames.push(props.shade)
  if (props.normalCase) classNames.push("is-normal-case")
  return classNames
}
