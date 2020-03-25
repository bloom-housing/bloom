import t from "./translator"

export const lRoute = (routeString: string) => {
  let routePrefix = t("config.routePrefix")
  if (routePrefix == "config.routePrefix" || routePrefix == "") {
    routePrefix = "" // no prefix needed for default routes
  } else {
    routePrefix = "/" + routePrefix
  }
  return `${routePrefix}${routeString}`
}
