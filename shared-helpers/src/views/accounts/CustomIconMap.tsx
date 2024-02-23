import { Application, Profile, Cog } from "./CustomIcons"

export const CustomIconMap = {
  application: Application,
  profile: Profile,
  cog: Cog,
}

export type CustomIconType = keyof typeof CustomIconMap
