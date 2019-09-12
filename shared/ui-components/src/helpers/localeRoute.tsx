import t from "./translator"

const lRoute = (routeString: string) => {
  let routePrefix = t("config.route_prefix")
  if (routePrefix == "config.route_prefix" || routePrefix == "") {
    routePrefix = "" // no prefix needed for default routes
  } else {
    routePrefix = "/" + routePrefix
  }
  return `${routePrefix}${routeString}`
}

export default lRoute
