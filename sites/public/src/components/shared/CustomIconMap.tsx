import { Application, Profile } from "./CustomIcons"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
}

export type CustomIconType = keyof typeof CustomIconMap
