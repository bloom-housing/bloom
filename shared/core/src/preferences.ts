export interface PreferenceLink {
  title: string
  url: string
}

export interface Preference {
  ordinal: number
  title: string
  subtitle?: string
  description?: string
  links?: PreferenceLink[]
}
