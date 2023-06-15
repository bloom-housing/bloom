import _ from "lodash"
export const isExternalLink = (href: string) => {
  return href.startsWith("http://") || href.startsWith("https://")
}

export const isInternalLink = (href: string) => {
  return href.startsWith("/") && !href.startsWith("//")
}

export interface JumplinkData {
  title: string
  // Warning -- id_override does not namespace the id by default
  // (see generateJumplinkId for more information)
  idOverride?: string
}

// HTML ids are global, singletons, and turn into window object keys, so
// we namespace here to avoid accidental collisions.
export const generateJumplinkId = (data: JumplinkData) => {
  return data.idOverride ? data.idOverride : `${_.kebabCase(data.title)}-section`
}
